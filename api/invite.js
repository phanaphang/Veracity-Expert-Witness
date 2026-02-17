const supabaseAdmin = require('./_lib/supabaseAdmin');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the caller is an admin
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Check admin role
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { email, first_name, last_name } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Email format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // Input length limits
  if (email.length > 500 || (first_name && first_name.length > 200) || (last_name && last_name.length > 200)) {
    return res.status(400).json({ error: 'Input exceeds maximum allowed length.' });
  }

  // Whitelist allowed redirect origins
  const allowedOrigins = ['https://veracityexpertwitness.com', 'https://www.veracityexpertwitness.com', 'http://localhost:3000'];
  const origin = req.headers.origin;
  const redirectBase = allowedOrigins.includes(origin) ? origin : 'https://veracityexpertwitness.com';

  try {
    // Invite user via Supabase Auth
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${redirectBase}/portal/auth/callback`,
      data: {
        first_name: first_name || '',
        last_name: last_name || '',
        role: 'expert',
      },
    });

    if (inviteError) {
      console.error('Invite error:', inviteError.message);
      const msg = inviteError.message?.toLowerCase() || '';
      if (msg.includes('already registered') || msg.includes('already been registered') || msg.includes('duplicate') || msg.includes('already exists')) {
        return res.status(409).json({ error: 'This email is already registered. If the expert needs a new invite, delete their account from Supabase Auth first.' });
      }
      return res.status(400).json({ error: `Failed to send invitation: ${inviteError.message}` });
    }

    // Record invitation
    await supabaseAdmin.from('invitations').insert({
      email,
      invited_by: user.id,
      first_name: first_name || null,
      last_name: last_name || null,
    });

    // Update profile with name if provided
    if (inviteData?.user?.id && (first_name || last_name)) {
      await supabaseAdmin
        .from('profiles')
        .update({
          first_name: first_name || null,
          last_name: last_name || null,
          invited_at: new Date().toISOString(),
        })
        .eq('id', inviteData.user.id);
    }

    return res.status(200).json({ success: true, message: `Invitation sent to ${email}` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send invitation' });
  }
};
