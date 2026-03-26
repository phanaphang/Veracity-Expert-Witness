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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const auth = await verifyAdmin(req)
    if (auth.error) return res.status(auth.status).json({ error: auth.error })

    const { data: profileRows, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, first_name, last_name')
      .in('role', ['admin', 'staff'])

    if (profileError) {
      console.error('[SOP OVERVIEW]', profileError.message)
      return res.status(500).json({ error: 'Failed to fetch staff data' })
    }

    const userIds = (profileRows || []).map((p) => p.id)

    let progressRows = []
    if (userIds.length > 0) {
      const { data, error: progressError } = await supabaseAdmin
        .from('sop_training_progress')
        .select(
          'user_id, module_id, completed, quiz_score, attempts, completed_at, last_attempt_at'
        )
        .in('user_id', userIds)

      if (progressError) {
        console.error('[SOP OVERVIEW]', progressError.message)
        return res.status(500).json({ error: 'Failed to fetch training data' })
      }
      progressRows = data || []
    }

    const staffMap = {}
    ;(profileRows || []).forEach((p) => {
      const name =
        [p.first_name, p.last_name].filter(Boolean).join(' ').trim() || p.email
      staffMap[p.id] = {
        name,
        email: p.email,
        role: p.role,
        modules: [],
      }
    })

    progressRows.forEach((row) => {
      if (staffMap[row.user_id]) {
        staffMap[row.user_id].modules.push({
          moduleId: row.module_id,
          completed: row.completed,
          quizScore: row.quiz_score,
          attempts: row.attempts,
          completedAt: row.completed_at,
          lastAttemptAt: row.last_attempt_at,
        })
      }
    })

    return res.status(200).json({ staff: Object.values(staffMap) })
  } catch (err) {
    console.error('[SOP OVERVIEW ERROR]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
