const supabaseAdmin = require('./_lib/supabaseAdmin')
const { rateLimit } = require('./_lib/rateLimit')

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify the caller is an admin
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn(
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | notify-case-manager | missing token`
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
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | notify-case-manager | invalid token`
    )
    return res.status(401).json({ error: 'Invalid token' })
  }

  const { data: callerProfile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (callerProfile?.role !== 'admin') {
    console.warn(
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | notify-case-manager | insufficient role: ${callerProfile?.role}`
    )
    return res.status(403).json({ error: 'Admin access required' })
  }

  const rl = rateLimit(req, { maxRequests: 10 })
  if (rl.limited) {
    res.setHeader('Retry-After', String(rl.retryAfter))
    return res
      .status(429)
      .json({ error: 'Too many requests. Please try again later.' })
  }

  const { caseManagerId, caseTitle, caseId } = req.body
  if (!caseManagerId || !caseTitle) {
    return res
      .status(400)
      .json({ error: 'Case manager ID and case title are required' })
  }

  // Get the case manager's profile
  const { data: manager } = await supabaseAdmin
    .from('profiles')
    .select('email, first_name, last_name')
    .eq('id', caseManagerId)
    .single()

  if (!manager) {
    return res.status(404).json({ error: 'Case manager not found' })
  }

  const managerName = manager.first_name
    ? `${manager.first_name} ${manager.last_name ? manager.last_name.charAt(0) + '.' : ''}`.trim()
    : 'there'
  const caseUrl = `https://veracityexpertwitness.com/admin/cases/${caseId}`

  const plainText = `Case Manager Assignment\n\nHi ${managerName},\n\nYou have been assigned as the Case Manager for the following case:\n\n${caseTitle}\n\nView case details: ${caseUrl}\n\n— Veracity Expert Witness Portal`

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a365d; padding: 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">Veracity Expert Witness</h1>
      </div>
      <div style="padding: 32px 24px; background: #fff;">
        <h2 style="margin: 0 0 16px; color: #1a202c;">Case Manager Assignment</h2>
        <p style="color: #4a5568; line-height: 1.6; margin: 0 0 16px;">
          Hi ${escapeHtml(managerName)},
        </p>
        <p style="color: #4a5568; line-height: 1.6; margin: 0 0 24px;">
          You have been assigned as the Case Manager for the following case:
        </p>
        <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
          <p style="margin: 0; font-weight: 600; color: #1a202c; font-size: 16px;">${escapeHtml(caseTitle)}</p>
        </div>
        <a href="${caseUrl}" style="display: inline-block; background: #1a365d; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">
          View Case Details
        </a>
      </div>
      <div style="padding: 16px 24px; background: #f7fafc; text-align: center; font-size: 12px; color: #a0aec0;">
        Veracity Expert Witness Portal
      </div>
    </div>
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
              recipients: [manager.email],
              headers: {
                subject: `You've been assigned as Case Manager: ${escapeHtml(caseTitle)}`,
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
      return res
        .status(500)
        .json({ error: 'Failed to send notification email' })
    }

    return res
      .status(200)
      .json({ success: true, message: `Notification sent to ${manager.email}` })
  } catch (err) {
    console.error('Email send error:', err.message)
    return res.status(500).json({ error: 'Failed to send notification email' })
  }
}
