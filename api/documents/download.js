const supabaseAdmin = require('../_lib/supabaseAdmin');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { path } = req.query;
  if (!path) {
    return res.status(400).json({ error: 'File path is required' });
  }

  // Check authorization: user owns the file or is admin
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';
  const ownsFile = path.startsWith(`${user.id}/`);

  if (!isAdmin && !ownsFile) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { data, error } = await supabaseAdmin.storage
    .from('expert-documents')
    .createSignedUrl(path, 300); // 5 minute expiry

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ signedUrl: data.signedUrl });
};
