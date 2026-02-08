module.exports = (req, res) => {
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

  console.log('Contact form submission:', { name, firm, email, phone, expertise, details });

  res.json({
    success: true,
    message: 'Your request has been submitted successfully. We will be in touch within 24 hours.',
  });
};
