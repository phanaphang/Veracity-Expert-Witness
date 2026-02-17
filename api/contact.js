const escapeHtml = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const MAX_LEN = { short: 500, long: 5000 };

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, firm, email, phone, expertise, details, website, _elapsed } = req.body;

  // Anti-bot: honeypot field filled
  if (website) {
    return res.json({ success: true, message: 'Your request has been submitted successfully.' });
  }

  // Anti-bot: form submitted too quickly (< 3 seconds)
  if (typeof _elapsed === 'number' && _elapsed < 3) {
    return res.json({ success: true, message: 'Your request has been submitted successfully.' });
  }

  if (!name || !firm || !email || !phone || !expertise || !details) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Input length limits
  if (name.length > MAX_LEN.short || firm.length > MAX_LEN.short || email.length > MAX_LEN.short ||
      phone.length > 30 || expertise.length > MAX_LEN.short || details.length > MAX_LEN.long) {
    return res.status(400).json({ error: 'One or more fields exceed the maximum allowed length.' });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const htmlContent = `
    <h2>New Expert Witness Request</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;">
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Firm</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(firm)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(email)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(phone)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Expertise</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(expertise)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Case Details</td><td style="padding:8px;">${escapeHtml(details)}</td></tr>
    </table>
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
            recipients: ['info@veracityexpertwitness.com'],
            headers: {
              subject: `New Expert Witness Request: ${escapeHtml(expertise)} - ${escapeHtml(name)}`,
              from: 'noreply@veracityexpertwitness.com',
              'reply-to': email.replace(/[\r\n]/g, ''),
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
      return res.status(500).json({ error: 'Failed to send your request. Please try again.' });
    }

    res.json({
      success: true,
      message: 'Your request has been submitted successfully. We will be in touch within 24 hours.',
    });
  } catch (error) {
    console.error('Email send error:', error.message);
    res.status(500).json({ error: 'Failed to send your request. Please try again.' });
  }
};
