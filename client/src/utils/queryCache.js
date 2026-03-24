const cache = {}

export function getCached(key, fetcher, ttlMs = 5 * 60 * 1000) {
  const entry = cache[key]
  if (entry && Date.now() - entry.ts < ttlMs) {
    return Promise.resolve(entry.data)
  }
  if (entry?.promise) return entry.promise

  const promise = fetcher()
    .then((result) => {
      cache[key] = { data: result, ts: Date.now(), promise: null }
      return result
    })
    .catch((err) => {
      delete cache[key]
      throw err
    })

  cache[key] = { ...(entry || {}), promise }
  return promise
}

export function invalidateCache(key) {
  if (key) {
    delete cache[key]
  } else {
    Object.keys(cache).forEach((k) => delete cache[k])
  }
}
