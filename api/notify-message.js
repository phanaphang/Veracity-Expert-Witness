const supabaseAdmin = require('./_lib/supabaseAdmin');
const { rateLimit } = require('./_lib/rateLimit');

const escapeHtml = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn(`[AUTH FAIL] ${new Date().toISOString()} | ${ip} | notify-message | missing token`);
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    console.warn(`[AUTH FAIL] ${new Date().toISOString()} | ${ip} | notify-message | invalid token`);
    return res.status(401).json({ error: 'Invalid token' });
  }

  const rl = rateLimit(req, { maxRequests: 30 });
  if (rl.limited) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { recipientId, senderName, messagePreview } = req.body;
  if (!recipientId || !senderName || !messagePreview) {
    return res.status(400).json({ error: 'recipientId, senderName, and messagePreview are required' });
  }

  const { data: recipient } = await supabaseAdmin
    .from('profiles')
    .select('email, first_name, last_name')
    .eq('id', recipientId)
    .single();

  if (!recipient) {
    return res.status(404).json({ error: 'Recipient not found' });
  }

  const recipientName = recipient.first_name
    ? `${recipient.first_name} ${recipient.last_name ? recipient.last_name.charAt(0) + '.' : ''}`.trim()
    : 'there';

  const preview = messagePreview.length > 200 ? messagePreview.slice(0, 200) + '…' : messagePreview;
  const messagesUrl = 'https://veracityexpertwitness.com/portal/messages';

  const plainText = `New Message\n\nHi ${recipientName},\n\nYou have a new message from ${senderName}:\n\n"${preview}"\n\nView your messages: ${messagesUrl}\n\n— Veracity Expert Witness Portal`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a365d; padding: 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">Veracity Expert Witness</h1>
      </div>
      <div style="padding: 32px 24px; background: #fff;">
        <h2 style="margin: 0 0 16px; color: #1a202c;">New Message</h2>
        <p style="color: #4a5568; line-height: 1.6; margin: 0 0 16px;">
          Hi ${escapeHtml(recipientName)},
        </p>
        <p style="color: #4a5568; line-height: 1.6; margin: 0 0 24px;">
          You have a new message from <strong>${escapeHtml(senderName)}</strong>:
        </p>
        <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
          <p style="margin: 0; color: #2d3748; font-style: italic;">&ldquo;${escapeHtml(preview)}&rdquo;</p>
        </div>
        <a href="${messagesUrl}" style="display: inline-block; background: #1a365d; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">
          View Messages
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
            recipients: [recipient.email],
            headers: {
              subject: `New message from ${senderName}`,
              from: 'noreply@veracityexpertwitness.com',
              'List-Unsubscribe': '<mailto:admin@veracityexpertwitness.com?subject=Unsubscribe>',
            },
            content: {
              'text/html': htmlContent,
              'text/plain': plainText,
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
