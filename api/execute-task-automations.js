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

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn(
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | execute-task-automations | missing token`
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
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | execute-task-automations | invalid token`
    )
    return res.status(401).json({ error: 'Invalid token' })
  }

  const { data: callerProfile } = await supabaseAdmin
    .from('profiles')
    .select('role, first_name, last_name')
    .eq('id', user.id)
    .single()

  if (!callerProfile || !['admin', 'staff'].includes(callerProfile.role)) {
    console.warn(
      `[AUTH FAIL] ${new Date().toISOString()} | ${ip} | execute-task-automations | insufficient role: ${callerProfile?.role}`
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

  const { taskId, caseId, trigger, automations, taskTitle, assigneeId } =
    req.body
  if (
    !taskId ||
    !caseId ||
    !trigger ||
    !automations ||
    !Array.isArray(automations)
  ) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const callerName = callerProfile.first_name
    ? `${callerProfile.first_name} ${callerProfile.last_name || ''}`.trim()
    : 'A Veracity team member'
  const triggerLabel = trigger === 'on_start' ? 'started' : 'completed'
  const results = []

  for (const automation of automations) {
    try {
      if (automation.type === 'create_tasks' && automation.tasks?.length) {
        const rows = automation.tasks
          .filter((t) => t.title?.trim())
          .map((t) => ({
            case_id: caseId,
            title: t.title.trim(),
            description: t.description?.trim() || '',
            priority: t.priority || 'medium',
            status: t.status || 'to_do',
            assignee: t.assignee || assigneeId || null,
            due_date: t.due_date || null,
            created_by: user.id,
            automations: t.automations || null,
          }))
        if (rows.length) {
          const { error } = await supabaseAdmin.from('case_tasks').insert(rows)
          if (error) throw error
          for (const row of rows) {
            await supabaseAdmin.from('case_activity_log').insert({
              case_id: caseId,
              actor: user.id,
              action: 'task_auto_created',
              details: {
                task_title: row.title,
                priority: row.priority,
                triggered_by: taskTitle || taskId,
                trigger,
              },
            })
          }
          results.push({
            type: 'create_tasks',
            success: true,
            count: rows.length,
          })
        }
      } else if (automation.type === 'email_assignee' && assigneeId) {
        const { data: assignee } = await supabaseAdmin
          .from('profiles')
          .select('email, first_name, last_name')
          .eq('id', assigneeId)
          .single()

        if (assignee?.email) {
          const assigneeName = assignee.first_name || 'there'
          const message = automation.message?.trim() || ''
          const tasksUrl = 'https://veracityexpertwitness.com/portal/my-tasks'

          const plainText = `Task Update\n\nHi ${assigneeName},\n\n${callerName} has ${triggerLabel} the task "${taskTitle || 'Untitled'}".\n\n${message ? message + '\n\n' : ''}View your tasks: ${tasksUrl}\n\n- Veracity Expert Witness Portal`

          const htmlContent = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #1a365d; padding: 24px; text-align: center;">
                <h1 style="color: #fff; margin: 0; font-size: 20px;">Veracity Expert Witness</h1>
              </div>
              <div style="padding: 32px 24px; background: #fff;">
                <h2 style="margin: 0 0 16px; color: #1a202c;">Task ${escapeHtml(triggerLabel)}</h2>
                <p style="color: #4a5568; line-height: 1.6; margin: 0 0 16px;">
                  Hi ${escapeHtml(assigneeName)},
                </p>
                <p style="color: #4a5568; line-height: 1.6; margin: 0 0 24px;">
                  ${escapeHtml(callerName)} has ${triggerLabel} the following task:
                </p>
                <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 0 0 24px;">
                  <p style="margin: 0 0 8px; font-weight: 600; color: #1a202c; font-size: 16px;">${escapeHtml(taskTitle || 'Untitled')}</p>
                  <p style="margin: 0; color: #4a5568; font-size: 14px;">Status: ${triggerLabel === 'started' ? 'In Progress' : 'Done'}</p>
                </div>
                ${message ? `<p style="color: #4a5568; line-height: 1.6; margin: 0 0 24px;">${escapeHtml(message)}</p>` : ''}
                <a href="${tasksUrl}" style="display: inline-block; background: #1a365d; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">
                  View My Tasks
                </a>
              </div>
              <div style="padding: 16px 24px; background: #f7fafc; text-align: center; font-size: 12px; color: #a0aec0;">
                Veracity Expert Witness Portal
              </div>
            </div>
          `

          const apiUser = (process.env.PAUBOX_API_USER || '').trim()
          const apiKey = (process.env.PAUBOX_API_KEY || '').trim()

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
                    recipients: [assignee.email],
                    headers: {
                      subject: `Task ${triggerLabel}: ${taskTitle || 'Untitled'}`,
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
            console.error(
              'Paubox API error (task email):',
              response.status,
              errorText
            )
            results.push({
              type: 'email_assignee',
              success: false,
              error: 'Email send failed',
            })
            continue
          }
          results.push({ type: 'email_assignee', success: true })
        } else {
          results.push({
            type: 'email_assignee',
            success: false,
            error: 'No assignee email',
          })
        }
      } else if (automation.type === 'create_event' && assigneeId) {
        const eventTitle = automation.title?.trim()
        if (!eventTitle) {
          results.push({
            type: 'create_event',
            success: false,
            error: 'No event title',
          })
          continue
        }

        const offsetDays = parseInt(automation.offset_days, 10) || 0
        const durationHours = parseFloat(automation.duration_hours) || 1

        const startTime = new Date()
        startTime.setDate(startTime.getDate() + offsetDays)
        startTime.setHours(9, 0, 0, 0)

        const endTime = new Date(startTime)
        endTime.setHours(startTime.getHours() + durationHours)

        const { error } = await supabaseAdmin.from('calendar_events').insert({
          expert_id: assigneeId,
          title: eventTitle,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          notes: `Auto-created when task "${taskTitle || 'Untitled'}" was ${triggerLabel}.`,
          case_id: caseId,
        })

        if (error) {
          console.error('Calendar event insert error:', error.message)
          results.push({
            type: 'create_event',
            success: false,
            error: error.message,
          })
          continue
        }

        await supabaseAdmin.from('case_activity_log').insert({
          case_id: caseId,
          actor: user.id,
          action: 'automation_executed',
          details: {
            automation_type: 'create_event',
            event_title: eventTitle,
            triggered_by: taskTitle || taskId,
            trigger,
          },
        })

        results.push({ type: 'create_event', success: true })
      }
    } catch (err) {
      console.error(`Automation error (${automation.type}):`, err.message)
      results.push({
        type: automation.type,
        success: false,
        error: err.message,
      })
    }
  }

  return res.status(200).json({ success: true, results })
}
