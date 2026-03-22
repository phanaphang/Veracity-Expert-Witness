const supabaseAdmin = require('./_lib/supabaseAdmin');
const { rateLimit } = require('./_lib/rateLimit');

module.exports = async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the caller is an admin
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn(`[AUTH FAIL] ${new Date().toISOString()} | ${ip} | delete-expert | missing token`);
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    console.warn(`[AUTH FAIL] ${new Date().toISOString()} | ${ip} | delete-expert | invalid token`);
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Check admin role (not staff)
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    console.warn(`[AUTH FAIL] ${new Date().toISOString()} | ${ip} | delete-expert | insufficient role: ${profile?.role}`);
    return res.status(403).json({ error: 'Admin access required' });
  }

  const rl = rateLimit(req, { maxRequests: 10 });
  if (rl.limited) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { expertId } = req.body;
  if (!expertId) {
    return res.status(400).json({ error: 'Expert ID is required' });
  }

  // Verify the target is an expert (not an admin/staff)
  const { data: expertProfile } = await supabaseAdmin
    .from('profiles')
    .select('role, email')
    .eq('id', expertId)
    .single();

  if (!expertProfile) {
    return res.status(404).json({ error: 'Expert not found' });
  }

  if (expertProfile.role !== 'expert') {
    return res.status(403).json({ error: 'Can only delete expert accounts' });
  }

  try {
    // Delete from auth (cascades to profiles and related tables)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(expertId);
    if (deleteError) {
      return res.status(400).json({ error: 'Failed to delete expert. Please try again.' });
    }

    return res.status(200).json({ success: true, message: `Expert ${expertProfile.email} has been deleted` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete expert' });
  }
};
