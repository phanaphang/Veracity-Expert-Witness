const supabaseAdmin = require('./_lib/supabaseAdmin');

const escapeHtml = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
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

  const { data: callerProfile } = await supabaseAdmin
    .from('profiles')
    .select('role, first_name, last_name')
    .eq('id', user.id)
    .single();

  if (!callerProfile || !['admin', 'staff'].includes(callerProfile.role)) {
    return res.status(403).json({ error: 'Admin or staff access required' });
  }

  const { expertId, eventTitle, startTime, endTime, action } = req.body;
  if (!expertId || !eventTitle || !startTime || !endTime || !action) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data: expert } = await supabaseAdmin
    .from('profiles')
    .select('email, first_name, last_name')
    .eq('id', expertId)
    .single();

  if (!expert?.email) {
    return res.status(404).json({ error: 'Expert not found' });
  }

  const expertName = expert.first_name ? `${expert.first_name}` : 'there';
  const adminName = callerProfile.first_name
    ? `${callerProfile.first_name} ${callerProfile.last_name || ''}`.trim()
    : 'A Veracity team member';

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };
  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
  };

  const actionLabel = action === 'created' ? 'added a new event' : 'updated an event';
  const calendarUrl = 'https://veracityexpertwitness.com/portal/calendar';

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a365d; padding: 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">Veracity Expert Witness</h1>
      </div>
      <div style="padding: 32px 24px; background: #fff;">
        <h2 style="margin: 0 0 16px; color: #1a202c;">Calendar Update</h2>
        <p style="color: #4a5568; line-height: 1.6; margin: 0 0 16px;">
          Hi ${escapeHtml(expertName)},
        </p>
        <p style="color: #4a5568; line-height: 1.6; margin: 0 0 24px;">
          ${escapeHtml(adminName)} has ${actionLabel} on your calendar:
        </p>
        <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
          <p style="margin: 0 0 8px; font-weight: 600; color: #1a202c; font-size: 16px;">${escapeHtml(eventTitle)}</p>
          <p style="margin: 0 0 4px; color: #4a5568; font-size: 14px;">${escapeHtml(formatDate(startTime))}</p>
          <p style="margin: 0; color: #4a5568; font-size: 14px;">${escapeHtml(formatTime(startTime))} &ndash; ${escapeHtml(formatTime(endTime))}</p>
        </div>
        <a href="${calendarUrl}" style="display: inline-block; background: #1a365d; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">
          View My Calendar
        </a>
      </div>
      <div style="padding: 16px 24px; background: #f7fafc; text-align: center; font-size: 12px; color: #a0aec0;">
        Veracity Expert Witness Portal
      </div>
    </div>
  `;

  const apiUser = (process.env.PAUBOX_API_USER || '').trim();
  const apiKey = (process.env.PAUBOX_API_KEY || '').trim();

  try {
    const response = await fetch(`https://api.paubox.net/v1/${apiUser}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Token token=${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          message: {
            recipients: [expert.email],
            headers: {
              subject: `Calendar ${action === 'created' ? 'event added' : 'event updated'}: ${eventTitle}`,
              from: 'noreply@veracityexpertwitness.com',
            },
            content: {
              'text/html': htmlContent,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Paubox API error:', response.status, errorText);
      return res.status(500).json({ error: 'Failed to send notification email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email send error:', err.message);
    return res.status(500).json({ error: 'Failed to send notification email' });
  }
};
