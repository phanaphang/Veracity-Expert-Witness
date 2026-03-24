const supabaseAdmin = require('./_lib/supabaseAdmin')
const { rateLimit } = require('./_lib/rateLimit')

const escapeHtml = (str) =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn(
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | case-response | missing token`
    )
    return res.status(401).json({ error: 'Missing authorization token' })
  }

  const token = authHeader.replace('Bearer ', '')
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) {
    console.warn(
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | case-response | invalid token`
    )
    return res.status(401).json({ error: 'Invalid token' })
  }

  const rl = rateLimit(req, { maxRequests: 10 })
  if (rl.limited) {
    res.setHeader('Retry-After', String(rl.retryAfter))
    return res
      .status(429)
      .json({ error: 'Too many requests. Please try again later.' })
  }

  // Verify caller role and identity
  const { data: callerProfile } = await supabaseAdmin
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (
    !callerProfile ||
    !['expert', 'admin', 'staff'].includes(callerProfile.role)
  ) {
    console.warn(
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | case-response | insufficient role: ${callerProfile?.role}`
    )
    return res.status(403).json({ error: 'Access denied' })
  }

  const { expertName, expertEmail, caseTitle, action } = req.body

  if (!expertName || !expertEmail || !caseTitle || !action) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  const actionLabels = {
    accepted: 'Interested',
    declined: 'Declined',
    info_requested: 'Requested More Info',
  }

  const label = actionLabels[action]
  if (!label) {
    return res.status(400).json({ error: 'Invalid action.' })
  }

  const plainText = `Case Response Notification\n\nAn expert has responded to a case invitation.\n\nExpert: ${expertName}\nEmail: ${expertEmail}\nCase: ${caseTitle}\nResponse: ${label}`

  const htmlContent = `
    <h2>Case Response Notification</h2>
    <p>An expert has responded to a case invitation.</p>
    <table style="border-collapse:collapse;width:100%;max-width:600px;">
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Expert</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(expertName)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(expertEmail)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Case</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(caseTitle)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Response</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${label}</strong></td></tr>
    </table>
  `

  const apiUser = (process.env.PAUBOX_API_USER || '').trim()
  const apiKey = (process.env.PAUBOX_API_KEY || '').trim()

  try {
    const response = await fetch(
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
                process.env.CONTACT_EMAIL ||
                  'support@veracityexpertwitness.com',
                process.env.ADMIN_EMAIL || 'support@veracityexpertwitness.com',
              ],
              headers: {
                subject: `Case Response: ${escapeHtml(expertName)} ${label} — ${escapeHtml(caseTitle)}`,
                from:
                  process.env.NOREPLY_EMAIL ||
                  'noreply@veracityexpertwitness.com',
                'List-Unsubscribe': `<mailto:${process.env.CONTACT_EMAIL || 'support@veracityexpertwitness.com'}?subject=Unsubscribe>`,
              },
              content: {
                'text/html': htmlContent,
                'text/plain': plainText,
              },
            },
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Paubox API error:', response.status, errorText)
      return res.status(500).json({ error: 'Failed to send notification.' })
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Email send error:', error.message)
    res.status(500).json({ error: 'Failed to send notification.' })
  }
}
