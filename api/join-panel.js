module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, credentials, email, phone, specialty, bio, website, _elapsed } = req.body;

  // Anti-bot: honeypot field filled
  if (website) {
    return res.json({ success: true, message: 'Your application has been submitted successfully.' });
  }

  // Anti-bot: form submitted too quickly (< 3 seconds)
  if (typeof _elapsed === 'number' && _elapsed < 3) {
    return res.json({ success: true, message: 'Your application has been submitted successfully.' });
  }

  if (!name || !credentials || !email || !phone || !specialty || !bio) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const htmlContent = `
    <h2>New Expert Panel Application</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;">
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Credentials / Title</td><td style="padding:8px;border-bottom:1px solid #eee;">${credentials}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${phone}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Primary Specialty</td><td style="padding:8px;border-bottom:1px solid #eee;">${specialty}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Bio / Experience</td><td style="padding:8px;">${bio}</td></tr>
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
              subject: `New Expert Panel Application: ${specialty} - ${name}`,
              from: 'noreply@veracityexpertwitness.com',
              'reply-to': email,
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
      return res.status(500).json({ error: 'Failed to send your application. Please try again.' });
    }

    res.json({
      success: true,
      message: 'Your application has been submitted successfully. We will review your information and be in touch soon.',
    });
  } catch (error) {
    console.error('Email send error:', error.message);
    res.status(500).json({ error: 'Failed to send your application. Please try again.' });
  }
};
