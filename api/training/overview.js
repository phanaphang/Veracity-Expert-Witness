const supabaseAdmin = require('../_lib/supabaseAdmin');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check admin role in staff_profiles
    const { data: staffProfile } = await supabaseAdmin
      .from('staff_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (staffProfile?.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Fetch training overview
    const { data: rows, error: fetchError } = await supabaseAdmin
      .from('sop_training_overview')
      .select('*');

    if (fetchError) {
      console.error('[TRAINING OVERVIEW]', fetchError.message);
      return res.status(500).json({ error: 'Failed to fetch training data' });
    }

    // Group by staff member
    const staffMap = {};
    (rows || []).forEach((row) => {
      if (!staffMap[row.user_id]) {
        staffMap[row.user_id] = {
          name: row.full_name,
          role: row.role,
          modules: [],
        };
      }
      if (row.module_id) {
        staffMap[row.user_id].modules.push({
          moduleId: row.module_id,
          completed: row.completed,
          quizScore: row.quiz_score,
          attempts: row.attempts,
          completedAt: row.completed_at,
          lastAttemptAt: row.last_attempt_at,
        });
      }
    });

    return res.status(200).json({ staff: Object.values(staffMap) });
  } catch (err) {
    console.error('[TRAINING OVERVIEW ERROR]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
