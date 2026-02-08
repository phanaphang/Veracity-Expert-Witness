const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/contact', (req, res) => {
  const { name, firm, email, phone, expertise, details } = req.body;

  // Validate required fields
  if (!name || !firm || !email || !phone || !expertise || !details) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // In production, you would save to a database or send an email here
  console.log('Contact form submission received:');
  console.log({ name, firm, email, phone, expertise, details });

  res.json({
    success: true,
    message: 'Your request has been submitted successfully. We will be in touch within 24 hours.',
  });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
