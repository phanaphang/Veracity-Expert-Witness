import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import CaseActivityTab from '../admin/CaseActivityTab'

const PHASES = [
  { value: 'intake', label: 'Intake' },
  { value: 'records_review', label: 'Records Review' },
  { value: 'report_drafting', label: 'Report Drafting' },
  { value: 'report_review', label: 'Report Review' },
  { value: 'deposition_prep', label: 'Deposition Prep' },
  { value: 'trial_prep', label: 'Trial Prep' },
  { value: 'closed', label: 'Closed' },
]

const STATUS_LABELS = {
  to_do: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

const WORK_TYPE_LABELS = {
  review_report: 'Review/Report',
  deposition: 'Deposition',
  trial_testimony: 'Trial Testimony',
}

export default function ExpertCaseDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const [caseData, setCaseData] = useState(null)
  const [tasks, setTasks] = useState([])
  const [timeEntries, setTimeEntries] = useState([])
  const [activityLog, setActivityLog] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!user || !id) return
    let cancelled = false

    const load = async () => {
      try {
        const [caseRes, taskRes, timeRes, actRes] = await Promise.all([
          supabase
            .from('cases')
            .select('case_number, title, description, status, case_phase, specialties(name)')
            .eq('id', id)
            .single(),
          supabase
            .from('case_tasks')
            .select('id, title, description, due_date, priority, status')
            .eq('case_id', id)
            .order('created_at', { ascending: false }),
          supabase
            .from('case_time_entries')
            .select('hours, minutes, work_type')
            .eq('case_id', id),
          supabase
            .from('case_activity_log')
            .select('*, actorProfile:actor(first_name, last_name, email, role)')
            .eq('case_id', id)
            .order('created_at', { ascending: false })
            .limit(100),
        ])

        if (cancelled) return

        if (caseRes.error) {
          toast.error('Unable to load case details.')
          setLoading(false)
          return
        }

        setCaseData(caseRes.data)
        setTasks(taskRes.data || [])
        setTimeEntries(timeRes.data || [])
        setActivityLog(actRes.data || [])
      } catch {
        if (!cancelled) toast.error('Failed to load case.')
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id, user]) // eslint-disable-line

  if (loading)
    return (
      <div className="portal-loading" role="status" aria-label="Loading">
        <div className="portal-loading__spinner"></div>
      </div>
    )

  if (!caseData)
    return (
      <div className="portal-empty">
        <p className="portal-empty__text">
          Case not found or you do not have access.
        </p>
      </div>
    )

  const doneCount = tasks.filter((t) => t.status === 'done').length

  const timeSummary = (() => {
    const byType = { review_report: 0, deposition: 0, trial_testimony: 0 }
    let totalMinutes = 0
    timeEntries.forEach((e) => {
      const mins = (parseFloat(e.hours) || 0) * 60 + (parseInt(e.minutes) || 0)
      totalMinutes += mins
      if (byType[e.work_type] !== undefined) byType[e.work_type] += mins
    })
    return { totalHours: totalMinutes / 60, byType }
  })()

  return (
    <div>
      <div className="portal-page__header">
        <div>
          <Link
            to="/portal/cases"
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              marginBottom: 8,
              display: 'inline-block',
            }}
          >
            &larr; Back to Cases
          </Link>
          <h1 className="portal-page__title">
            #{caseData.case_number} - {caseData.title}
          </h1>
        </div>
      </div>

      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}
      >
        <span className={`portal-badge portal-badge--${caseData.status}`}>
          {caseData.status?.replace('_', ' ')}
        </span>
        {caseData.specialties?.name && (
          <span className="portal-badge portal-badge--open">
            {caseData.specialties.name}
          </span>
        )}
      </div>

      {/* Phase Indicator (read-only) */}
      <div className="case-phase-indicator">
        {PHASES.map((phase, idx) => {
          const currentIdx = PHASES.findIndex(
            (p) => p.value === caseData.case_phase
          )
          const isCompleted = idx < currentIdx
          const isCurrent = idx === currentIdx
          return (
            <React.Fragment key={phase.value}>
              {idx > 0 && (
                <div
                  className={`case-phase-connector${isCompleted ? ' case-phase-connector--completed' : ''}`}
                />
              )}
              <div
                className={`case-phase-step${isCompleted ? ' case-phase-step--completed' : ''}${isCurrent ? ' case-phase-step--current' : ''}`}
              >
                <div className="case-phase-step__dot" />
                <div className="case-phase-step__label">{phase.label}</div>
              </div>
            </React.Fragment>
          )
        })}
      </div>

      {/* Tab Bar */}
      <div className="case-tabs">
        {['overview', 'tasks', 'activity'].map((tab) => (
          <button
            key={tab}
            className={`case-tabs__btn${activeTab === tab ? ' case-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && 'Overview'}
            {tab === 'tasks' && `Tasks (${tasks.length})`}
            {tab === 'activity' && 'Activity'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {caseData.description && (
            <div className="portal-card">
              <h3 className="portal-card__title">Description</h3>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-gray-600)',
                  lineHeight: 1.6,
                }}
              >
                {caseData.description}
              </p>
            </div>
          )}

          <div className="case-time-summary">
            <div className="case-time-summary__card">
              <div className="case-time-summary__label">Total Hours Logged</div>
              <div className="case-time-summary__value">
                {timeSummary.totalHours.toFixed(1)}h
              </div>
            </div>
            {Object.entries(timeSummary.byType).map(([type, mins]) => (
              <div key={type} className="case-time-summary__card">
                <div className="case-time-summary__label">
                  {WORK_TYPE_LABELS[type]}
                </div>
                <div className="case-time-summary__value">
                  {(mins / 60).toFixed(1)}h
                </div>
              </div>
            ))}
          </div>

          <div className="portal-card">
            <h3 className="portal-card__title">Tasks Progress</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
              {doneCount} of {tasks.length} tasks complete
            </p>
            {tasks.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  background: 'var(--color-gray-100)',
                  borderRadius: 'var(--radius-md)',
                  height: 8,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0}%`,
                    height: '100%',
                    background: 'var(--color-success-dark)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tasks Tab (read-only) */}
      {activeTab === 'tasks' && (
        <div>
          <div className="case-tab-header">
            <span className="case-tab-header__count">
              {doneCount} of {tasks.length} tasks complete
            </span>
          </div>
          {tasks.length === 0 ? (
            <div className="portal-empty">
              <p className="portal-empty__text">No tasks assigned yet.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`case-task-item${task.status === 'done' ? ' case-task-item--done' : ''}`}
              >
                <div className="case-task-item__info">
                  <div className="case-task-item__title">{task.title}</div>
                  {task.description && (
                    <div className="case-task-item__desc">
                      {task.description}
                    </div>
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
                      {STATUS_LABELS[task.status] || task.status}
                    </span>
                    {task.due_date && (
                      <span>
                        Due:{' '}
                        {new Date(task.due_date + 'T00:00:00').toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <CaseActivityTab activityLog={activityLog} />
      )}
    </div>
  )
}
