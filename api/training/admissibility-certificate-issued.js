const supabaseAdmin = require('../_lib/supabaseAdmin');

// Server-side HTML escaping (DOMPurify is browser-only;
// all user content is escaped before insertion into HTML email)
const escapeHtml = (str) =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const MODULE_TITLE = 'Standards of Admissibility: Frye, Kelly, and Daubert';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn(
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | training/admissibility-certificate-issued | missing token`
    );
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = authHeader.replace('Bearer ', '');
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    console.warn(
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | training/admissibility-certificate-issued | invalid token`
    );
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Role check — expert, admin, or staff
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, first_name, last_name, email')
    .eq('id', user.id)
    .single();

  if (!profile || !['expert', 'admin', 'staff'].includes(profile.role)) {
    console.warn(
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | training/admissibility-certificate-issued | insufficient role`
    );
    return res.status(403).json({ error: 'Access denied' });
  }

  const { certificateName, completionDate, expertEmail } = req.body;

  if (!certificateName || !completionDate || !expertEmail) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Length guard
  if (
    certificateName.length > 200 ||
    completionDate.length > 50 ||
    expertEmail.length > 500
  ) {
    return res.status(400).json({ error: 'Input exceeds maximum allowed length.' });
  }

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(expertEmail)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const safeName = escapeHtml(certificateName);
  const safeDate = escapeHtml(completionDate);
  const safeEmail = escapeHtml(expertEmail);

  const expertHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1a1f3a;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h1 style="color:#ffffff;margin:0;font-size:22px;">Veracity Expert Witness</h1>
        <p style="color:#d36622;margin:4px 0 0;font-size:14px;">${MODULE_TITLE}</p>
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <h2 style="color:#1a1f3a;margin-top:0;">Congratulations, ${safeName}!</h2>
        <p style="color:#374151;">You have successfully completed the <strong>${MODULE_TITLE}</strong> training module.</p>
        <table style="border-collapse:collapse;width:100%;margin:24px 0;">
          <tr>
            <td style="padding:10px 12px;font-weight:bold;background:#f9fafb;border:1px solid #e5e7eb;color:#1a1f3a;">Certificate Name</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#374151;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-weight:bold;background:#f9fafb;border:1px solid #e5e7eb;color:#1a1f3a;">Completion Date</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#374151;">${safeDate}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-weight:bold;background:#f9fafb;border:1px solid #e5e7eb;color:#1a1f3a;">Course</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#374151;">${MODULE_TITLE} (~20 min)</td>
          </tr>
        </table>
        <p style="color:#374151;">Your certificate of completion is available in your expert portal under <strong>Training &gt; Certificate</strong>.</p>
        <p style="color:#6b7280;font-size:13px;margin-top:24px;">This email was sent by Veracity Expert Witness. Please do not reply to this message.</p>
      </div>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1a1f3a;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h1 style="color:#ffffff;margin:0;font-size:22px;">Veracity Expert Witness</h1>
        <p style="color:#d36622;margin:4px 0 0;font-size:14px;">Training Completion Notification</p>
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <h2 style="color:#1a1f3a;margin-top:0;">Panel Member Training Completed</h2>
        <p style="color:#374151;">A panel member has completed the ${MODULE_TITLE} training module.</p>
        <table style="border-collapse:collapse;width:100%;margin:24px 0;">
          <tr>
            <td style="padding:10px 12px;font-weight:bold;background:#f9fafb;border:1px solid #e5e7eb;color:#1a1f3a;">Certificate Name</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#374151;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-weight:bold;background:#f9fafb;border:1px solid #e5e7eb;color:#1a1f3a;">Email</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#374151;">${safeEmail}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-weight:bold;background:#f9fafb;border:1px solid #e5e7eb;color:#1a1f3a;">Completion Date</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#374151;">${safeDate}</td>
          </tr>
        </table>
        <p style="color:#6b7280;font-size:13px;margin-top:24px;">Veracity Expert Witness — Internal Notification</p>
      </div>
    </div>
  `;

  const apiUser = (process.env.PAUBOX_API_USER || '').trim();
  const apiKey = (process.env.PAUBOX_API_KEY || '').trim();

  try {
    // Email 1: Expert confirmation
    const expertRes = await fetch(
      `https://api.paubox.net/v1/${apiUser}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token token=${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            message: {
              recipients: [expertEmail],
              headers: {
                subject: `You've completed ${MODULE_TITLE} — Veracity`,
                from: 'noreply@veracityexpertwitness.com',
              },
              content: { 'text/html': expertHtml },
            },
          },
        }),
      }
    );

    if (!expertRes.ok) {
      const errText = await expertRes.text();
      console.error('Paubox expert email error:', expertRes.status, errText);
      return res.status(500).json({ error: 'Failed to send expert confirmation email.' });
    }

    // Email 2: Admin notification
    const adminRes = await fetch(
      `https://api.paubox.net/v1/${apiUser}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token token=${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            message: {
              recipients: [
                process.env.CONTACT_EMAIL || 'info@veracityexpertwitness.com',
                process.env.ADMIN_EMAIL || 'admin@veracityexpertwitness.com',
              ],
              headers: {
                subject: `Training Complete: ${escapeHtml(certificateName)} — ${MODULE_TITLE}`,
                from: 'noreply@veracityexpertwitness.com',
              },
              content: { 'text/html': adminHtml },
            },
          },
        }),
      }
    );

    if (!adminRes.ok) {
      const errText = await adminRes.text();
      console.error('Paubox admin email error:', adminRes.status, errText);
      // Non-fatal — expert email succeeded; log and continue
      console.error('Admin notification failed but expert email was sent.');
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('admissibility-certificate-issued error:', err.message);
    return res.status(500).json({ error: 'Failed to send completion emails.' });
  }
};
