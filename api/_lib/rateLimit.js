// In-memory rate limiter for Vercel serverless functions.
// Limits submissions per IP within a sliding window.
// Note: resets on cold starts, but effective against sustained abuse on warm instances.

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3;

const store = new Map(); // ip -> number[]

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

function rateLimit(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const timestamps = (store.get(ip) || []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((timestamps[0] + WINDOW_MS - now) / 1000);
    return { limited: true, retryAfter };
  }

  timestamps.push(now);
  store.set(ip, timestamps);

  // Prevent unbounded memory growth
  if (store.size > 5000) {
    for (const [key, ts] of store.entries()) {
      if (ts.every((t) => t <= windowStart)) store.delete(key);
    }
  }

  return { limited: false };
}

module.exports = { rateLimit };
