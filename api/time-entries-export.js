const supabaseAdmin = require('./_lib/supabaseAdmin')
const { rateLimit } = require('./_lib/rateLimit')

const WORK_TYPE_LABELS = {
  review_report: 'Review/Report',
  deposition: 'Deposition',
  trial_testimony: 'Trial Testimony',
}

function escapeCSV(val) {
  if (val == null) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n'))
    return '"' + str.replace(/"/g, '""') + '"'
  return str
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rl = rateLimit(req, { maxRequests: 20 })
  if (rl.limited) {
    res.setHeader('Retry-After', String(rl.retryAfter))
    return res
      .status(429)
      .json({ error: 'Too many requests. Please try again later.' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' })
  }

  const token = authHeader.replace('Bearer ', '')
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'staff'].includes(profile.role)) {
    return res.status(403).json({ error: 'Admin access required' })
  }

  const caseId = req.query.caseId
  if (!caseId) {
    return res.status(400).json({ error: 'caseId is required' })
  }

  try {
    const { data: caseData } = await supabaseAdmin
      .from('cases')
      .select(
        'case_number, assigned_expert, assignedExpert:assigned_expert(rate_review_report, rate_deposition, rate_trial_testimony)'
      )
      .eq('id', caseId)
      .single()

    const { data: entries, error: entriesError } = await supabaseAdmin
      .from('case_time_entries')
      .select('*, logger:logged_by(first_name, last_name), task:task_id(title)')
      .eq('case_id', caseId)
      .order('logged_at', { ascending: false })

    if (entriesError) {
      console.error('[TIME EXPORT]', entriesError.message)
      return res.status(500).json({ error: 'Failed to fetch time entries' })
    }

    const expertRates = caseData?.assignedExpert || {}
    const rateMap = {
      review_report: parseFloat(expertRates.rate_review_report) || 0,
      deposition: parseFloat(expertRates.rate_deposition) || 0,
      trial_testimony: parseFloat(expertRates.rate_trial_testimony) || 0,
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

    const rows = (entries || []).map((entry) => {
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

    const csv = [
      headers.map(escapeCSV).join(','),
      ...rows.map((r) => r.map(escapeCSV).join(',')),
    ].join('\n')

    const filename = `case-${caseData?.case_number || caseId}-time-entries.csv`
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    return res.status(200).send(csv)
  } catch (err) {
    console.error('[TIME EXPORT ERROR]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
