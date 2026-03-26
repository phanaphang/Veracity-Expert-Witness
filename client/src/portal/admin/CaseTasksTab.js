import React, { useState, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { formatName } from '../../utils/formatName'
import { useToast } from '../../contexts/ToastContext'
import TaskComments from './TaskComments'
import TaskAttachments from './TaskAttachments'

const PRIORITY_OPTIONS = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const STATUS_OPTIONS = [
  { value: 'to_do', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const AUTOMATION_TYPES = [
  { value: 'create_tasks', label: 'Create Task(s)' },
  { value: 'email_assignee', label: 'Email Assignee' },
  { value: 'create_event', label: 'Calendar Event' },
]

const EMPTY_SUB_TASK = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'to_do',
  assignee: '',
  due_date: '',
}

const DEPTH_COLORS = [
  '#1a365d',
  '#2b6cb0',
  '#2f855a',
  '#9b2c2c',
  '#744210',
  '#553c9a',
  '#1a202c',
]

function EventAutomationFields({ auto, onUpdate }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const sanitize = (term) => term.replace(/[%_(),.\\]/g, '')

  const searchUser = async (term) => {
    setSearchTerm(term)
    if (term.length < 2) {
      setSearchResults([])
      return
    }
    const safe = sanitize(term)
    if (!safe) {
      setSearchResults([])
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .or(
        `first_name.ilike.%${safe}%,last_name.ilike.%${safe}%,email.ilike.%${safe}%`
      )
      .limit(10)
    setSearchResults(data || [])
  }

  const selectUser = (user) => {
    onUpdate({ expert_id: user.id, expert_name: formatName(user) })
    setSearchTerm('')
    setSearchResults([])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <input
        className="portal-field__input"
        placeholder="Event title *"
        value={auto.title || ''}
        onChange={(e) => onUpdate({ title: e.target.value })}
        maxLength={200}
      />
      <div style={{ position: 'relative' }}>
        <label
          className="portal-field__label"
          style={{ fontSize: '0.78rem', marginBottom: 2 }}
        >
          Assign to user
        </label>
        {auto.expert_id ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 0',
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>
              {auto.expert_name || auto.expert_id}
            </span>
            <button
              type="button"
              className="task-automations__item-remove"
              style={{ fontSize: '0.75rem' }}
              onClick={() => onUpdate({ expert_id: '', expert_name: '' })}
            >
              x
            </button>
          </div>
        ) : (
          <input
            className="portal-field__input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => searchUser(e.target.value)}
          />
        )}
        {searchResults.length > 0 && (
          <div
            style={{
              border: '1px solid var(--color-gray-200)',
              borderRadius: 'var(--radius-md, 6px)',
              marginTop: 2,
              position: 'absolute',
              background: '#fff',
              zIndex: 10,
              width: '100%',
              maxHeight: 200,
              overflowY: 'auto',
            }}
          >
            {searchResults.map((user) => (
              <div
                key={user.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 10px',
                  borderBottom: '1px solid var(--color-gray-100)',
                  cursor: 'pointer',
                }}
                onClick={() => selectUser(user)}
              >
                <div>
                  <strong style={{ fontSize: '0.82rem' }}>
                    {formatName(user)}
                  </strong>
                  <span
                    style={{
                      fontSize: '0.76rem',
                      color: 'var(--color-gray-400)',
                      marginLeft: 6,
                    }}
                  >
                    {user.email}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--color-gray-400)',
                      marginLeft: 4,
                    }}
                  >
                    ({user.role})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <div>
          <label
            className="portal-field__label"
            style={{ fontSize: '0.78rem', marginBottom: 2 }}
          >
            Start date &amp; time
          </label>
          <input
            className="portal-field__input"
            type="datetime-local"
            value={auto.start_time || ''}
            onChange={(e) => onUpdate({ start_time: e.target.value })}
          />
        </div>
        <div>
          <label
            className="portal-field__label"
            style={{ fontSize: '0.78rem', marginBottom: 2 }}
          >
            End date &amp; time
          </label>
          <input
            className="portal-field__input"
            type="datetime-local"
            value={auto.end_time || ''}
            onChange={(e) => onUpdate({ end_time: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

function TaskAutomationEditor({ automations, onChange, assigneeList }) {
  const [path, setPath] = useState([])

  const resolve = () => {
    let node = automations
    for (const step of path) {
      const auto = node[step.triggerKey]?.[step.autoIdx]
      if (!auto || auto.type !== 'create_tasks') return null
      const task = auto.tasks?.[step.taskIdx]
      if (!task) return null
      node = task.automations || { on_start: [], on_complete: [] }
    }
    return node
  }

  const applyUpdate = (newLeaf) => {
    if (path.length === 0) {
      onChange(newLeaf)
      return
    }
    let root = JSON.parse(JSON.stringify(automations))
    let node = root
    const parents = [{ node: root, step: null }]
    for (const step of path) {
      const next = node[step.triggerKey][step.autoIdx].tasks[step.taskIdx]
      if (!next.automations)
        next.automations = { on_start: [], on_complete: [] }
      parents.push({ node: next.automations, step })
      node = next.automations
    }
    Object.assign(node, newLeaf)
    onChange(root)
  }

  const current = resolve()
  if (!current) {
    setPath([])
    return null
  }

  const depth = path.length
  const numColor = DEPTH_COLORS[depth % DEPTH_COLORS.length]
  const subNumColor = DEPTH_COLORS[(depth + 1) % DEPTH_COLORS.length]

  const update = (triggerKey, idx, updates) => {
    applyUpdate({
      ...current,
      [triggerKey]: current[triggerKey].map((a, i) =>
        i === idx ? { ...a, ...updates } : a
      ),
    })
  }
  const remove = (triggerKey, idx) => {
    applyUpdate({
      ...current,
      [triggerKey]: current[triggerKey].filter((_, i) => i !== idx),
    })
  }
  const add = (triggerKey, type) => {
    const item =
      type === 'create_tasks'
        ? { type, tasks: [EMPTY_SUB_TASK] }
        : type === 'email_assignee'
          ? { type, message: '' }
          : {
              type,
              title: '',
              expert_id: '',
              expert_name: '',
              start_time: '',
              end_time: '',
            }
    applyUpdate({
      ...current,
      [triggerKey]: [...(current[triggerKey] || []), item],
    })
  }

  return (
    <div className="task-automations">
      {path.length > 0 && (
        <div
          className="task-automations__breadcrumb"
          style={{ borderLeftColor: numColor }}
        >
          <button
            type="button"
            className="task-automations__breadcrumb-item"
            onClick={() => setPath([])}
          >
            Root
          </button>
          {path.map((step, i) => (
            <React.Fragment key={i}>
              <span className="task-automations__breadcrumb-sep">&rsaquo;</span>
              <button
                type="button"
                className="task-automations__breadcrumb-item"
                style={{ color: DEPTH_COLORS[(i + 1) % DEPTH_COLORS.length] }}
                onClick={() => setPath(path.slice(0, i + 1))}
              >
                {step.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {['on_start', 'on_complete'].map((triggerKey) => (
        <div key={triggerKey} style={{ marginBottom: 12 }}>
          <div className="task-automations__trigger">
            {triggerKey === 'on_start' ? 'When Started' : 'When Completed'}
          </div>
          {(current[triggerKey] || []).map((auto, idx) => (
            <div key={idx} className="task-automations__item">
              <span
                className="task-automations__item-num"
                style={{ background: numColor }}
              >
                {idx + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: 4,
                    fontSize: '0.78rem',
                  }}
                >
                  {AUTOMATION_TYPES.find((t) => t.value === auto.type)?.label}
                </div>

                {auto.type === 'create_tasks' && (
                  <div>
                    {auto.tasks.map((subTask, si) => {
                      const subAutos = subTask.automations || {
                        on_start: [],
                        on_complete: [],
                      }
                      const subAutoCount =
                        (subAutos.on_start?.length || 0) +
                        (subAutos.on_complete?.length || 0)
                      const updateSub = (field, value) => {
                        const upd = [...auto.tasks]
                        upd[si] = { ...upd[si], [field]: value }
                        update(triggerKey, idx, { tasks: upd })
                      }
                      return (
                        <div key={si} className="task-automations__subtask">
                          <div className="task-automations__subtask-header">
                            <span
                              className="task-automations__subtask-num"
                              style={{ background: subNumColor }}
                            >
                              {si + 1}
                            </span>
                            <input
                              className="portal-field__input"
                              placeholder="Task title *"
                              value={subTask.title}
                              onChange={(e) =>
                                updateSub('title', e.target.value)
                              }
                              style={{ flex: 1 }}
                              maxLength={200}
                            />
                            {auto.tasks.length > 1 && (
                              <button
                                type="button"
                                className="task-automations__item-remove"
                                onClick={() =>
                                  update(triggerKey, idx, {
                                    tasks: auto.tasks.filter(
                                      (_, i) => i !== si
                                    ),
                                  })
                                }
                              >
                                x
                              </button>
                            )}
                          </div>
                          <textarea
                            className="portal-field__textarea"
                            placeholder="Description"
                            value={subTask.description || ''}
                            onChange={(e) =>
                              updateSub('description', e.target.value)
                            }
                            rows={2}
                            maxLength={2000}
                            style={{ marginTop: 4 }}
                          />
                          <div className="task-automations__subtask-fields">
                            <select
                              className="portal-field__select"
                              value={subTask.priority || 'medium'}
                              onChange={(e) =>
                                updateSub('priority', e.target.value)
                              }
                            >
                              {PRIORITY_OPTIONS.map((p) => (
                                <option key={p.value} value={p.value}>
                                  {p.label}
                                </option>
                              ))}
                            </select>
                            <select
                              className="portal-field__select"
                              value={subTask.status || 'to_do'}
                              onChange={(e) =>
                                updateSub('status', e.target.value)
                              }
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                            <select
                              className="portal-field__select"
                              value={subTask.assignee || ''}
                              onChange={(e) =>
                                updateSub('assignee', e.target.value)
                              }
                            >
                              <option value="">Unassigned</option>
                              {assigneeList.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {formatName(m)}
                                </option>
                              ))}
                            </select>
                            <input
                              className="portal-field__input"
                              type="date"
                              value={subTask.due_date || ''}
                              onChange={(e) =>
                                updateSub('due_date', e.target.value)
                              }
                            />
                          </div>
                          <button
                            type="button"
                            className="portal-btn-action task-automations__subtask-toggle"
                            style={{
                              borderColor: subNumColor,
                              color: subNumColor,
                            }}
                            onClick={() =>
                              setPath([
                                ...path,
                                {
                                  triggerKey,
                                  autoIdx: idx,
                                  taskIdx: si,
                                  label: subTask.title || `Task ${si + 1}`,
                                },
                              ])
                            }
                          >
                            Edit Automations
                            {subAutoCount > 0 && ` (${subAutoCount})`} &rsaquo;
                          </button>
                        </div>
                      )
                    })}
                    <button
                      type="button"
                      className="portal-btn-action"
                      style={{ padding: '2px 8px', marginTop: 2 }}
                      onClick={() =>
                        update(triggerKey, idx, {
                          tasks: [...auto.tasks, EMPTY_SUB_TASK],
                        })
                      }
                    >
                      + Add Task
                    </button>
                  </div>
                )}

                {auto.type === 'email_assignee' && (
                  <textarea
                    className="portal-field__textarea"
                    placeholder="Message to include in email"
                    value={auto.message}
                    onChange={(e) =>
                      update(triggerKey, idx, { message: e.target.value })
                    }
                    rows={2}
                    maxLength={500}
                  />
                )}

                {auto.type === 'create_event' && (
                  <EventAutomationFields
                    auto={auto}
                    onUpdate={(updates) => update(triggerKey, idx, updates)}
                  />
                )}
              </div>
              <button
                type="button"
                className="task-automations__item-remove"
                onClick={() => remove(triggerKey, idx)}
              >
                x
              </button>
            </div>
          ))}
          <select
            className="portal-field__select"
            value=""
            onChange={(e) => {
              if (e.target.value) add(triggerKey, e.target.value)
              e.target.value = ''
            }}
            style={{ maxWidth: 180 }}
          >
            <option value="">+ Add automation...</option>
            {AUTOMATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}

function AutomationPreview({ automations, assigneeList = [], depth = 0 }) {
  if (!automations) return null
  const color = DEPTH_COLORS[depth % DEPTH_COLORS.length]
  const subColor = DEPTH_COLORS[(depth + 1) % DEPTH_COLORS.length]
  const indent = Math.min(depth * 12, 48)
  const hasAny =
    (automations.on_start?.length || 0) +
      (automations.on_complete?.length || 0) >
    0
  if (!hasAny) return null

  const resolveAssignee = (id) => {
    if (!id) return null
    const match = assigneeList.find((m) => m.id === id)
    return match ? formatName(match) : null
  }

  return (
    <div
      style={
        depth > 0
          ? {
              marginTop: 4,
              marginLeft: indent,
              paddingLeft: 10,
              borderLeft: `3px solid ${color}`,
            }
          : undefined
      }
    >
      {['on_start', 'on_complete'].map((triggerKey) => {
        const items = automations[triggerKey]
        if (!items?.length) return null
        return (
          <div key={triggerKey} style={{ marginBottom: 6 }}>
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color,
                margin: '4px 0',
              }}
            >
              {triggerKey === 'on_start' ? 'When Started' : 'When Completed'}
            </div>
            {items.map((auto, idx) => (
              <div key={idx} style={{ marginBottom: 4 }}>
                <div
                  className="task-automations-preview__item"
                  style={{ fontSize: '0.8rem' }}
                >
                  <span
                    className="task-automations-preview__num"
                    style={{ background: color }}
                  >
                    {idx + 1}
                  </span>
                  {auto.type === 'email_assignee' && (
                    <span>
                      Email assignee
                      {auto.message
                        ? `: "${auto.message.slice(0, 60)}${auto.message.length > 60 ? '...' : ''}"`
                        : ''}
                    </span>
                  )}
                  {auto.type === 'create_event' && (
                    <span>
                      Calendar event: {auto.title || '(untitled)'}
                      {auto.expert_name && ` - ${auto.expert_name}`}
                      {auto.start_time &&
                        ` | ${new Date(auto.start_time).toLocaleString()}`}
                      {auto.end_time &&
                        ` - ${new Date(auto.end_time).toLocaleTimeString()}`}
                    </span>
                  )}
                  {auto.type === 'create_tasks' && (
                    <span>
                      Create{' '}
                      {auto.tasks?.filter((t) => t.title?.trim()).length || 0}{' '}
                      task(s)
                    </span>
                  )}
                </div>
                {auto.type === 'create_tasks' &&
                  auto.tasks
                    ?.filter((t) => t.title?.trim())
                    .map((t, ti) => {
                      const assigneeName = resolveAssignee(t.assignee)
                      const dueLabel = t.due_date
                        ? new Date(
                            t.due_date + 'T00:00:00'
                          ).toLocaleDateString()
                        : null
                      return (
                        <div key={ti} style={{ marginLeft: 12, marginTop: 4 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: '0.78rem',
                              color: '#4a5568',
                              flexWrap: 'wrap',
                            }}
                          >
                            <span
                              className="task-automations-preview__num"
                              style={{
                                background: subColor,
                                width: 16,
                                height: 16,
                                fontSize: '0.6rem',
                              }}
                            >
                              {ti + 1}
                            </span>
                            <span style={{ fontWeight: 600 }}>{t.title}</span>
                            <span
                              className={`portal-badge portal-badge--${t.priority || 'medium'}`}
                              style={{ fontSize: '0.65rem' }}
                            >
                              {t.priority || 'medium'}
                            </span>
                            <span
                              className={`portal-badge portal-badge--${t.status || 'to_do'}`}
                              style={{ fontSize: '0.65rem' }}
                            >
                              {
                                STATUS_OPTIONS.find(
                                  (s) => s.value === (t.status || 'to_do')
                                )?.label
                              }
                            </span>
                          </div>
                          <div
                            style={{
                              marginLeft: 22,
                              fontSize: '0.76rem',
                              color: '#718096',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '4px 12px',
                              marginTop: 2,
                            }}
                          >
                            {assigneeName && (
                              <span>Assignee: {assigneeName}</span>
                            )}
                            {dueLabel && <span>Due: {dueLabel}</span>}
                          </div>
                          {t.description && (
                            <div
                              style={{
                                marginLeft: 22,
                                fontSize: '0.76rem',
                                color: '#718096',
                                marginTop: 1,
                                fontStyle: 'italic',
                              }}
                            >
                              {t.description.length > 120
                                ? t.description.slice(0, 120) + '...'
                                : t.description}
                            </div>
                          )}
                          <AutomationPreview
                            automations={t.automations}
                            assigneeList={assigneeList}
                            depth={depth + 1}
                          />
                        </div>
                      )
                    })}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

const EMPTY_FORM = {
  title: '',
  description: '',
  assignee: '',
  due_date: '',
  priority: 'medium',
  status: 'to_do',
  automations: { on_start: [], on_complete: [] },
}

export default function CaseTasksTab({
  caseId,
  tasks,
  onTasksChange,
  profile,
  managers,
  caseData,
}) {
  const toast = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [expandedTask, setExpandedTask] = useState(null)
  const [expandedAutomation, setExpandedAutomation] = useState(null)
  const [expandedFiles, setExpandedFiles] = useState(null)
  const [showAutomations, setShowAutomations] = useState(false)

  const assigneeOptions = useMemo(() => {
    const opts = []
    const seen = new Set()
    if (managers) {
      managers.forEach((m) => {
        if (!seen.has(m.id)) {
          seen.add(m.id)
          opts.push(m)
        }
      })
    }
    if (caseData?.assignedExpert && !seen.has(caseData.assigned_expert)) {
      opts.push({
        id: caseData.assigned_expert,
        first_name: caseData.assignedExpert.first_name,
        last_name: caseData.assignedExpert.last_name,
        email: caseData.assignedExpert.email,
        role: caseData.assignedExpert.role,
      })
    }
    return opts
  }, [managers, caseData])

  const filtered = useMemo(() => {
    if (!filterStatus) return tasks
    return tasks.filter((t) => t.status === filterStatus)
  }, [tasks, filterStatus])

  const doneCount = tasks.filter((t) => t.status === 'done').length

  const logActivity = async (action, details) => {
    await supabase.from('case_activity_log').insert({
      case_id: caseId,
      actor: profile.id,
      action,
      details,
    })
  }

  const openCreate = () => {
    setEditingTask(null)
    setForm(EMPTY_FORM)
    setShowAutomations(false)
    setShowForm(true)
  }

  const openEdit = (task) => {
    setEditingTask(task)
    const automations = task.automations || { on_start: [], on_complete: [] }
    setForm({
      title: task.title,
      description: task.description || '',
      assignee: task.assignee || '',
      due_date: task.due_date || '',
      priority: task.priority,
      status: task.status,
      automations,
    })
    setShowAutomations(
      (automations.on_start?.length || 0) +
        (automations.on_complete?.length || 0) >
        0
    )
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingTask(null)
    setForm(EMPTY_FORM)
    setShowAutomations(false)
  }

  const fireAutomations = async (task, trigger) => {
    const autos = task.automations?.[trigger]
    if (!autos?.length) return
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      await fetch('/api/execute-task-automations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          taskId: task.id,
          caseId,
          trigger,
          automations: autos,
          taskTitle: task.title,
          assigneeId: task.assignee || null,
        }),
      })
    } catch (e) {
      // Best-effort -- don't block the status change
    }
  }

  const cleanAutomations = (auto) => {
    if (!auto) return null
    const cleanTask = (t) => {
      const { _showAutos, ...rest } = t
      if (!rest.assignee) delete rest.assignee
      if (!rest.due_date) delete rest.due_date
      if (!rest.description) delete rest.description
      if (rest.automations) {
        rest.automations = cleanAutomations(rest.automations)
      }
      return rest
    }
    const clean = (list) =>
      (list || [])
        .filter((a) => {
          if (a.type === 'create_tasks')
            return a.tasks?.some((t) => t.title?.trim())
          if (a.type === 'email_assignee') return a.message?.trim()
          if (a.type === 'create_event') return a.title?.trim()
          return false
        })
        .map((a) => {
          if (a.type === 'create_tasks') {
            return {
              ...a,
              tasks: a.tasks.filter((t) => t.title?.trim()).map(cleanTask),
            }
          }
          return a
        })
    const on_start = clean(auto.on_start)
    const on_complete = clean(auto.on_complete)
    return on_start.length || on_complete.length
      ? { on_start, on_complete }
      : null
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Task title is required.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        case_id: caseId,
        title: form.title.trim(),
        description: form.description.trim(),
        assignee: form.assignee || null,
        due_date: form.due_date || null,
        priority: form.priority,
        status: form.status,
        automations: cleanAutomations(form.automations),
      }

      if (editingTask) {
        const { error } = await supabase
          .from('case_tasks')
          .update(payload)
          .eq('id', editingTask.id)
        if (error) throw error

        const changes = []
        if (editingTask.status !== form.status)
          changes.push(`status: ${form.status}`)
        if (editingTask.priority !== form.priority)
          changes.push(`priority: ${form.priority}`)
        if (editingTask.title !== form.title.trim())
          changes.push('title updated')

        await logActivity('task_updated', {
          task_title: form.title.trim(),
          changes: changes.join(', ') || 'details updated',
        })
        toast.success('Task updated.')

        if (editingTask.status !== form.status) {
          const trigger =
            form.status === 'in_progress'
              ? 'on_start'
              : form.status === 'done'
                ? 'on_complete'
                : null
          if (trigger) {
            const savedTask = {
              ...editingTask,
              ...payload,
              automations: payload.automations,
            }
            fireAutomations(savedTask, trigger)
            onTasksChange()
            closeForm()
            setSaving(false)
            return
          }
        }
      } else {
        payload.created_by = profile.id
        const { error } = await supabase.from('case_tasks').insert(payload)
        if (error) throw error
        await logActivity('task_created', {
          task_title: form.title.trim(),
          priority: form.priority,
        })
        toast.success('Task created.')
      }

      closeForm()
      onTasksChange()
    } catch (err) {
      toast.error('Failed to save task: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleStatusToggle = async (task) => {
    const nextStatus =
      task.status === 'to_do'
        ? 'in_progress'
        : task.status === 'in_progress'
          ? 'done'
          : 'to_do'

    const { error } = await supabase
      .from('case_tasks')
      .update({ status: nextStatus })
      .eq('id', task.id)
    if (error) {
      toast.error('Failed to update task status.')
      return
    }
    await logActivity('task_updated', {
      task_title: task.title,
      changes: `status: ${nextStatus}`,
    })

    const trigger =
      nextStatus === 'in_progress'
        ? 'on_start'
        : nextStatus === 'done'
          ? 'on_complete'
          : null
    if (trigger) fireAutomations(task, trigger)

    onTasksChange()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('case_tasks')
        .delete()
        .eq('id', deleteTarget.id)
      if (error) throw error
      await logActivity('task_deleted', { task_title: deleteTarget.title })
      toast.success('Task deleted.')
      setDeleteTarget(null)
      onTasksChange()
    } catch (err) {
      toast.error('Failed to delete task: ' + err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="case-tab-header">
        <div className="case-tab-header__filters">
          <select
            className="portal-field__select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ minWidth: 140 }}
          >
            <option value="">All Tasks</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <span className="case-tab-header__count">
            {doneCount} of {tasks.length} tasks complete
          </span>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>
          Add Task
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="portal-empty">
          <p className="portal-empty__text">
            {tasks.length === 0
              ? 'No tasks yet. Click "Add Task" to create one.'
              : 'No tasks match the selected filter.'}
          </p>
        </div>
      ) : (
        filtered.map((task) => (
          <div key={task.id} className="my-task-card">
            <div
              className={`case-task-item${task.status === 'done' ? ' case-task-item--done' : ''}`}
              style={{ marginBottom: 0 }}
            >
              <div className="case-task-item__info">
                <div className="case-task-item__title">{task.title}</div>
                {task.description && (
                  <div className="case-task-item__desc">{task.description}</div>
                )}
                <div className="case-task-item__meta">
                  <span
                    className={`portal-badge portal-badge--${task.priority}`}
                  >
                    {task.priority}
                  </span>
                  <span className={`portal-badge portal-badge--${task.status}`}>
                    {STATUS_OPTIONS.find((s) => s.value === task.status)?.label}
                  </span>
                  {task.assigneeProfile && (
                    <span>{formatName(task.assigneeProfile)}</span>
                  )}
                  {task.due_date && (
                    <span>
                      Due:{' '}
                      {new Date(
                        task.due_date + 'T00:00:00'
                      ).toLocaleDateString()}
                    </span>
                  )}
                  {task.automations && (
                    <span className="portal-badge portal-badge--automation">
                      Automations
                    </span>
                  )}
                </div>
              </div>
              <div className="case-task-item__actions">
                <button
                  className="portal-btn-action"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  onClick={() => handleStatusToggle(task)}
                  title={
                    task.status === 'to_do'
                      ? 'Start'
                      : task.status === 'in_progress'
                        ? 'Complete'
                        : 'Reopen'
                  }
                >
                  {task.status === 'to_do'
                    ? 'Start'
                    : task.status === 'in_progress'
                      ? 'Complete'
                      : 'Reopen'}
                </button>
                <button
                  className="portal-btn-action"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  onClick={() => openEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="portal-btn-action"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  onClick={() =>
                    setExpandedTask(expandedTask === task.id ? null : task.id)
                  }
                >
                  {expandedTask === task.id ? 'Hide Comments' : 'Comments'}
                </button>
                <button
                  className="portal-btn-action"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  onClick={() =>
                    setExpandedFiles(expandedFiles === task.id ? null : task.id)
                  }
                >
                  {expandedFiles === task.id ? 'Hide Files' : 'Files'}
                </button>
                <button
                  className="portal-btn-action"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  onClick={() =>
                    setExpandedAutomation(
                      expandedAutomation === task.id ? null : task.id
                    )
                  }
                >
                  {expandedAutomation === task.id
                    ? 'Hide Automations'
                    : 'Automations'}
                </button>
                <button
                  className="portal-btn-action"
                  style={{
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    color: 'var(--color-error)',
                    borderColor: 'var(--color-error)',
                  }}
                  onClick={() => setDeleteTarget(task)}
                >
                  Delete
                </button>
              </div>
            </div>
            {expandedTask === task.id && (
              <TaskComments taskId={task.id} profile={profile} />
            )}
            {expandedFiles === task.id && (
              <TaskAttachments
                taskId={task.id}
                caseId={caseId}
                profile={profile}
              />
            )}
            {expandedAutomation === task.id && (
              <div className="task-automations-preview">
                {task.automations &&
                (task.automations.on_start?.length || 0) +
                  (task.automations.on_complete?.length || 0) >
                  0 ? (
                  <AutomationPreview
                    automations={task.automations}
                    assigneeList={assigneeOptions}
                  />
                ) : (
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--color-gray-500, #a0aec0)',
                      margin: 0,
                    }}
                  >
                    No automations configured. Click Edit to add some.
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      )}

      {/* Task Form Modal */}
      {showForm && (
        <div
          className="portal-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="portal-card"
            style={{
              maxWidth: 520,
              width: '90%',
              padding: 24,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <h3 style={{ marginBottom: 16 }}>
              {editingTask ? 'Edit Task' : 'Add Task'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="portal-field__label">Title *</label>
                <input
                  className="portal-field__input"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  maxLength={200}
                />
              </div>
              <div>
                <label className="portal-field__label">Description</label>
                <textarea
                  className="portal-field__textarea"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  maxLength={2000}
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                <div>
                  <label className="portal-field__label">Priority</label>
                  <select
                    className="portal-field__select"
                    value={form.priority}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, priority: e.target.value }))
                    }
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="portal-field__label">Status</label>
                  <select
                    className="portal-field__select"
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value }))
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                <div>
                  <label className="portal-field__label">Assignee</label>
                  <select
                    className="portal-field__select"
                    value={form.assignee}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, assignee: e.target.value }))
                    }
                  >
                    <option value="">Unassigned</option>
                    {assigneeOptions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {formatName(m)} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="portal-field__label">Due Date</label>
                  <input
                    className="portal-field__input"
                    type="date"
                    value={form.due_date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, due_date: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Automations Section */}
              <div
                style={{
                  borderTop: '1px solid var(--color-gray-200, #e2e8f0)',
                  paddingTop: 12,
                }}
              >
                <button
                  type="button"
                  className="portal-btn-action"
                  style={{ fontSize: '0.82rem', marginBottom: 8 }}
                  onClick={() => setShowAutomations(!showAutomations)}
                >
                  {showAutomations ? 'Hide' : 'Show'} Automations
                  {form.automations.on_start.length +
                    form.automations.on_complete.length >
                    0 &&
                    ` (${form.automations.on_start.length + form.automations.on_complete.length})`}
                </button>
                {showAutomations && (
                  <TaskAutomationEditor
                    automations={form.automations}
                    onChange={(newAutos) =>
                      setForm((f) => ({ ...f, automations: newAutos }))
                    }
                    assigneeList={assigneeOptions}
                  />
                )}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
                marginTop: 20,
              }}
            >
              <button
                className="portal-btn-action"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="btn btn--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : editingTask ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="portal-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="portal-card"
            style={{ maxWidth: 440, width: '90%', padding: 24 }}
          >
            <h3 style={{ marginBottom: 12 }}>Delete Task</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>{deleteTarget.title}</strong>?
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
                marginTop: 20,
              }}
            >
              <button
                className="portal-btn-action"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn--primary"
                style={{ background: 'var(--color-error)' }}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
