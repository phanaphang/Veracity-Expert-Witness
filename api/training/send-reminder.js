const supabaseAdmin = require('../_lib/supabaseAdmin')

async function verifyAdmin(req) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing authorization token', status: 401 }
  }

  const token = authHeader.replace('Bearer ', '')
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) {
    return { error: 'Invalid token', status: 401 }
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Admin access required', status: 403 }
  }

  return { user }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const auth = await verifyAdmin(req)
    if (auth.error) return res.status(auth.status).json({ error: auth.error })

    const { staffEmail, staffName, incompleteModules } = req.body

    if (
      !staffEmail ||
      !staffName ||
      !Array.isArray(incompleteModules) ||
      !incompleteModules.length
    ) {
      return res.status(400).json({
        error: 'staffEmail, staffName, and incompleteModules are required',
      })
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(staffEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const moduleList = incompleteModules
      .map((m) => `<li style="margin-bottom:6px;">${m}</li>`)
      .join('')

    const htmlBody = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #3e442b;">
        <h2 style="color: #094074; margin-bottom: 16px;">SOP Training Reminder</h2>
        <p>Hi ${staffName},</p>
        <p>You have <strong>${incompleteModules.length}</strong> SOP training module${incompleteModules.length > 1 ? 's' : ''} awaiting completion:</p>
        <ul style="padding-left: 20px; line-height: 1.8;">
          ${moduleList}
        </ul>
        <p>Please log in to the training portal and complete these modules at your earliest convenience.</p>
        <p style="margin-top: 24px;">
          <a href="https://veracityexpertwitness.com/sop-training"
             style="display: inline-block; padding: 12px 28px; background: #d36622; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Go to Training Hub
          </a>
        </p>
        <p style="margin-top: 32px; font-size: 13px; color: #736b62;">
          &mdash; Veracity Expert Witness LLC
        </p>
      </div>
    `

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:
          process.env.EMAIL_FROM ||
          'Veracity Expert Witness <noreply@veracityexpertwitness.com>',
        to: [staffEmail],
        subject: 'SOP Training Reminder \u2014 Modules Awaiting Completion',
        html: htmlBody,
      }),
    })

    if (!emailRes.ok) {
      const errBody = await emailRes.text()
      console.error('[SOP REMINDER] Resend error:', errBody)
      return res.status(502).json({ error: 'Failed to send reminder email' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('[SOP REMINDER ERROR]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
