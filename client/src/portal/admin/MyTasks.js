import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import TaskComments from './TaskComments'

const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 }
const STATUS_OPTIONS = [
  { value: 'to_do', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export default function MyTasks() {
  const { profile } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [expandedTask, setExpandedTask] = useState(null)

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

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

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
    if (error) return
    loadTasks()
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
                  onClick={() =>
                    setExpandedTask(expandedTask === task.id ? null : task.id)
                  }
                >
                  {expandedTask === task.id ? 'Hide Comments' : 'Comments'}
                </button>
              </div>
            </div>
            {expandedTask === task.id && (
              <TaskComments taskId={task.id} profile={profile} />
            )}
          </div>
        ))
      )}
    </div>
  )
}
