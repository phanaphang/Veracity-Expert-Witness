module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, firm, email, phone, expertise, details } = req.body;

  if (!name || !firm || !email || !phone || !expertise || !details) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const htmlContent = `
    <h2>New Expert Witness Request</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;">
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Firm</td><td style="padding:8px;border-bottom:1px solid #eee;">${firm}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${phone}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Expertise</td><td style="padding:8px;border-bottom:1px solid #eee;">${expertise}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Case Details</td><td style="padding:8px;">${details}</td></tr>
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
              subject: `New Expert Witness Request: ${expertise} - ${name}`,
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

    const result = await response.json();

    if (!response.ok) {
      console.error('Paubox API error:', response.status, JSON.stringify(result));
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
