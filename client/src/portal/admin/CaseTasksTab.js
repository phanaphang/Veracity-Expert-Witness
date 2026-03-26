import React, { useState, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { formatName } from '../../utils/formatName'
import { useToast } from '../../contexts/ToastContext'

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

const EMPTY_FORM = {
  title: '',
  description: '',
  assignee: '',
  due_date: '',
  priority: 'medium',
  status: 'to_do',
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
    setShowForm(true)
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setForm({
      title: task.title,
      description: task.description || '',
      assignee: task.assignee || '',
      due_date: task.due_date || '',
      priority: task.priority,
      status: task.status,
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingTask(null)
    setForm(EMPTY_FORM)
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
      }

      if (editingTask) {
        const { error } = await supabase
          .from('case_tasks')
          .update(payload)
          .eq('id', editingTask.id)
        if (error) throw error

        const changes = []
        if (editingTask.status !== form.status) changes.push(`status: ${form.status}`)
        if (editingTask.priority !== form.priority) changes.push(`priority: ${form.priority}`)
        if (editingTask.title !== form.title.trim()) changes.push('title updated')

        await logActivity('task_updated', {
          task_title: form.title.trim(),
          changes: changes.join(', ') || 'details updated',
        })
        toast.success('Task updated.')
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
          <div
            key={task.id}
            className={`case-task-item${task.status === 'done' ? ' case-task-item--done' : ''}`}
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
                <span
                  className={`portal-badge portal-badge--${task.status}`}
                >
                  {STATUS_OPTIONS.find((s) => s.value === task.status)?.label}
                </span>
                {task.assigneeProfile && (
                  <span>
                    {formatName(task.assigneeProfile)}
                  </span>
                )}
                {task.due_date && (
                  <span>
                    Due: {new Date(task.due_date + 'T00:00:00').toLocaleDateString()}
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
            style={{ maxWidth: 520, width: '90%', padding: 24 }}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
