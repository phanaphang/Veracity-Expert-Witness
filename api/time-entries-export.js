const supabaseAdmin = require('./_lib/supabaseAdmin')
const { rateLimit } = require('./_lib/rateLimit')

const WORK_TYPE_LABELS = {
  review_report: 'Review/Report',
  deposition: 'Deposition',
  trial_testimony: 'Trial Testimony',
}

function escapeCSV(value) {
  if (value == null) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn(
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | time-entries-export | missing token`
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
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | time-entries-export | invalid token`
    )
    return res.status(401).json({ error: 'Invalid token' })
  }

  const { data: callerProfile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!callerProfile || !['admin', 'staff'].includes(callerProfile.role)) {
    console.warn(
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | time-entries-export | insufficient role: ${callerProfile?.role}`
    )
    return res.status(403).json({ error: 'Admin or staff access required' })
  }

  const rl = rateLimit(req, { maxRequests: 20 })
  if (rl.limited) {
    res.setHeader('Retry-After', String(rl.retryAfter))
    return res
      .status(429)
      .json({ error: 'Too many requests. Please try again later.' })
  }

  const { caseId } = req.query
  if (!caseId) {
    return res.status(400).json({ error: 'caseId is required' })
  }

  try {
    const [caseRes, entriesRes] = await Promise.all([
      supabaseAdmin
        .from('cases')
        .select(
          'case_number, title, assigned_expert, assignedExpert:assigned_expert(rate_review_report, rate_deposition, rate_trial_testimony)'
        )
        .eq('id', caseId)
        .single(),
      supabaseAdmin
        .from('case_time_entries')
        .select(
          '*, logger:logged_by(first_name, last_name, email), task:task_id(title)'
        )
        .eq('case_id', caseId)
        .order('logged_at', { ascending: false }),
    ])

    if (caseRes.error) {
      return res.status(404).json({ error: 'Case not found' })
    }

    const caseInfo = caseRes.data
    const entries = entriesRes.data || []
    const rates = caseInfo.assignedExpert || {}

    const rateMap = {
      review_report: parseFloat(rates.rate_review_report) || 0,
      deposition: parseFloat(rates.rate_deposition) || 0,
      trial_testimony: parseFloat(rates.rate_trial_testimony) || 0,
    }

    const headers = [
      'Date',
      'Description',
      'Work Type',
      'Hours',
      'Minutes',
      'Total Hours',
      'Rate',
      'Cost',
      'Logged By',
      'Task',
    ]

    const rows = entries.map((entry) => {
      const hrs = parseFloat(entry.hours) || 0
      const mins = parseInt(entry.minutes) || 0
      const totalHrs = hrs + mins / 60
      const rate = rateMap[entry.work_type] || 0
      const cost = totalHrs * rate
      const loggerName = entry.logger
        ? `${entry.logger.first_name} ${entry.logger.last_name}`
        : ''

      return [
        new Date(entry.logged_at).toLocaleDateString(),
        entry.description || '',
        WORK_TYPE_LABELS[entry.work_type] || entry.work_type,
        hrs,
        mins,
        totalHrs.toFixed(2),
        rate.toFixed(2),
        cost.toFixed(2),
        loggerName,
        entry.task?.title || '',
      ]
    })

    const csvLines = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ]
    const csvString = csvLines.join('\n')

    const filename = `case-${caseInfo.case_number || caseId}-time-entries.csv`
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    return res.status(200).send(csvString)
  } catch (err) {
    console.error('time-entries-export error:', err)
    return res.status(500).json({ error: 'Failed to export time entries' })
  }
}
