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

  const { path: rawPath } = req.query;
  if (!rawPath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  // Normalize path and reject traversal attempts
  const normalizedPath = rawPath.split('/').filter(seg => seg !== '.' && seg !== '..' && seg !== '').join('/');
  if (normalizedPath !== rawPath || rawPath.includes('..')) {
    return res.status(400).json({ error: 'Invalid file path' });
  }

  // Check authorization: user owns the file or is admin
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';
  const ownsFile = normalizedPath.startsWith(`${user.id}/`);

  if (!isAdmin && !ownsFile) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { data, error } = await supabaseAdmin.storage
    .from('expert-documents')
    .createSignedUrl(normalizedPath, 60); // 1 minute expiry

  if (error) {
    return res.status(400).json({ error: 'File not found' });
  }

  return res.status(200).json({ signedUrl: data.signedUrl });
};
