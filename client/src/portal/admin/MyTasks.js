import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { formatName } from '../../utils/formatName'
import { useToast } from '../../contexts/ToastContext'
import TaskComments from './TaskComments'

const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 }
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

export default function MyTasks() {
  const { profile } = useAuth()
  const toast = useToast()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [expandedTask, setExpandedTask] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [managers, setManagers] = useState([])

  const loadTasks = useCallback(async () => {
    if (!profile) return
    const { data } = await supabase
      .from('case_tasks')
      .select(
        '*, case:case_id(id, title), assigneeProfile:assignee(id, first_name, last_name, email, role), creatorProfile:created_by(id, first_name, last_name, email, role)'
      )
      .eq('assignee', profile.id)
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
    if (data) {
      const sorted = data.sort((a, b) => {
        const pa = PRIORITY_ORDER[a.priority] ?? 9
        const pb = PRIORITY_ORDER[b.priority] ?? 9
        const da = a.due_date || '9999-12-31'
        const db = b.due_date || '9999-12-31'
        if (da !== db) return da < db ? -1 : 1
        return pa - pb
      })
      setTasks(sorted)
    }
    setLoading(false)
  }, [profile])

  const loadManagers = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .in('role', ['admin', 'staff'])
    if (data) setManagers(data)
  }, [])

  useEffect(() => {
    loadTasks()
    loadManagers()
  }, [loadTasks, loadManagers])

  const logActivity = async (caseId, action, details) => {
    await supabase.from('case_activity_log').insert({
      case_id: caseId,
      actor: profile.id,
      action,
      details,
    })
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
        title: form.title.trim(),
        description: form.description.trim(),
        assignee: form.assignee || null,
        due_date: form.due_date || null,
        priority: form.priority,
        status: form.status,
      }
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
      if (editingTask.title !== form.title.trim()) changes.push('title updated')

      await logActivity(editingTask.case_id, 'task_updated', {
        task_title: form.title.trim(),
        changes: changes.join(', ') || 'details updated',
      })
      toast.success('Task updated.')
      closeForm()
      loadTasks()
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
    await logActivity(task.case_id, 'task_updated', {
      task_title: task.title,
      changes: `status: ${nextStatus}`,
    })
    loadTasks()
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
      await logActivity(deleteTarget.case_id, 'task_deleted', {
        task_title: deleteTarget.title,
      })
      toast.success('Task deleted.')
      setDeleteTarget(null)
      loadTasks()
    } catch (err) {
      toast.error('Failed to delete task: ' + err.message)
    } finally {
      setDeleting(false)
    }
  }

  const filtered = filterStatus
    ? tasks.filter((t) => t.status === filterStatus)
    : tasks

  const doneCount = tasks.filter((t) => t.status === 'done').length

  const isOverdue = (d) => {
    if (!d) return false
    return new Date(d + 'T00:00:00') < new Date(new Date().toDateString())
  }

  if (loading) {
    return (
      <div>
        <div className="portal-page__header">
          <h1 className="portal-page__title">My Tasks</h1>
        </div>
        <div
          className="portal-card"
          style={{ padding: 32, textAlign: 'center' }}
        >
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">My Tasks</h1>
      </div>

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
            {doneCount} of {tasks.length} complete
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="portal-empty">
          <p className="portal-empty__text">
            {tasks.length === 0
              ? 'No tasks assigned to you.'
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
                  {task.case && (
                    <Link
                      to={`/admin/cases/${task.case.id}`}
                      style={{
                        color: 'var(--color-accent)',
                        textDecoration: 'none',
                      }}
                    >
                      {task.case.title}
                    </Link>
                  )}
                  {task.due_date && (
                    <span
                      style={
                        isOverdue(task.due_date) && task.status !== 'done'
                          ? { color: 'var(--color-error)', fontWeight: 600 }
                          : undefined
                      }
                    >
                      Due:{' '}
                      {new Date(
                        task.due_date + 'T00:00:00'
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="case-task-item__actions">
                <button
                  className="portal-btn-action"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  onClick={() => handleStatusToggle(task)}
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
          </div>
        ))
      )}

      {/* Edit Task Modal */}
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
            <h3 style={{ marginBottom: 16 }}>Edit Task</h3>
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
                    {managers.map((m) => (
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
                {saving ? 'Saving...' : 'Update'}
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
