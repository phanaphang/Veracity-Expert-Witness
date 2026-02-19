const escapeHtml = (str) =>
  String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { expertName, expertEmail, caseTitle, action } = req.body;

  if (!expertName || !expertEmail || !caseTitle || !action) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const actionLabels = {
    accepted: 'Accepted',
    declined: 'Declined',
    info_requested: 'Requested More Info',
  };

  const label = actionLabels[action];
  if (!label) {
    return res.status(400).json({ error: 'Invalid action.' });
  }

  const htmlContent = `
    <h2>Case Response Notification</h2>
    <p>An expert has responded to a case invitation.</p>
    <table style="border-collapse:collapse;width:100%;max-width:600px;">
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Expert</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(expertName)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(expertEmail)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Case</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(caseTitle)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Response</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${label}</strong></td></tr>
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
            recipients: ['info@veracityexpertwitness.com', 'admin@veracityexpertwitness.com'],
            headers: {
              subject: `Case Response: ${escapeHtml(expertName)} ${label} — ${escapeHtml(caseTitle)}`,
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
      return res.status(500).json({ error: 'Failed to send notification.' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error.message);
    res.status(500).json({ error: 'Failed to send notification.' });
  }
};
