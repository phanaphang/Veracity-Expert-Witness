import React, { useState } from 'react'

const PHASE_LABELS = {
  intake: 'Intake',
  records_review: 'Records Review',
  report_drafting: 'Report Drafting',
  report_review: 'Report Review',
  deposition_prep: 'Deposition Prep',
  trial_prep: 'Trial Prep',
  closed: 'Closed',
}

const WORK_TYPE_LABELS = {
  review_report: 'Review/Report',
  deposition: 'Deposition',
  trial_testimony: 'Trial Testimony',
}

function getDotClass(action) {
  if (action.startsWith('phase')) return 'case-timeline__dot--phase'
  if (action.startsWith('task')) return 'case-timeline__dot--task'
  if (action.startsWith('time')) return 'case-timeline__dot--time'
  if (action.startsWith('expert')) return 'case-timeline__dot--expert'
  if (action.startsWith('status')) return 'case-timeline__dot--status'
  return 'case-timeline__dot--details'
}

function formatAction(entry) {
  const d = entry.details || {}
  const actor = entry.actorProfile
    ? `${entry.actorProfile.first_name} ${entry.actorProfile.last_name}`
    : 'Someone'

  switch (entry.action) {
    case 'phase_changed':
      return (
        <>
          <span className="case-timeline__actor">{actor}</span> changed phase
          from{' '}
          <strong>{PHASE_LABELS[d.from] || d.from}</strong> to{' '}
          <strong>{PHASE_LABELS[d.to] || d.to}</strong>
        </>
      )
    case 'task_created':
      return (
        <>
          <span className="case-timeline__actor">{actor}</span> created task:{' '}
          <strong>{d.task_title}</strong>
        </>
      )
    case 'task_updated':
      return (
        <>
          <span className="case-timeline__actor">{actor}</span> updated task:{' '}
          <strong>{d.task_title}</strong>
          {d.changes ? ` - ${d.changes}` : ''}
        </>
      )
    case 'task_deleted':
      return (
        <>
          <span className="case-timeline__actor">{actor}</span> deleted task:{' '}
          <strong>{d.task_title}</strong>
        </>
      )
    case 'time_logged':
      return (
        <>
          <span className="case-timeline__actor">{actor}</span> logged{' '}
          <strong>
            {d.hours || 0}h {d.minutes || 0}m
          </strong>{' '}
          for {WORK_TYPE_LABELS[d.work_type] || d.work_type}
        </>
      )
    case 'time_deleted':
      return (
        <>
          <span className="case-timeline__actor">{actor}</span> deleted a time
          entry
        </>
      )
    case 'expert_assigned':
      return (
        <>
          <span className="case-timeline__actor">{actor}</span> assigned{' '}
          <strong>{d.expert_name}</strong> as expert
        </>
      )
    case 'expert_removed':
      return (
        <>
          <span className="case-timeline__actor">{actor}</span> removed{' '}
          <strong>{d.expert_name}</strong> as expert
        </>
      )
    case 'status_changed':
      return (
        <>
          <span className="case-timeline__actor">{actor}</span> changed status
          to <strong>{d.to}</strong>
        </>
      )
    case 'notes_updated':
      return (
        <>
          <span className="case-timeline__actor">{actor}</span> updated case
          notes
        </>
      )
    case 'details_updated':
      return (
        <>
          <span className="case-timeline__actor">{actor}</span> updated case
          details
        </>
      )
    default:
      return (
        <>
          <span className="case-timeline__actor">{actor}</span> {entry.action}
        </>
      )
  }
}

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

const PAGE_SIZE = 50

export default function CaseActivityTab({ activityLog }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  if (!activityLog || activityLog.length === 0) {
    return (
      <div className="portal-empty">
        <p className="portal-empty__text">No activity recorded yet.</p>
      </div>
    )
  }

  const visible = activityLog.slice(0, visibleCount)

  return (
    <div>
      <div className="case-timeline">
        {visible.map((entry) => (
          <div key={entry.id} className="case-timeline__item">
            <div
              className={`case-timeline__dot ${getDotClass(entry.action)}`}
            />
            <div className="case-timeline__content">
              {formatAction(entry)}
            </div>
            <div
              className="case-timeline__time"
              title={new Date(entry.created_at).toLocaleString()}
            >
              {timeAgo(entry.created_at)}
            </div>
          </div>
        ))}
      </div>
      {activityLog.length > visibleCount && (
        <button
          className="portal-btn-action"
          style={{ marginTop: 16 }}
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
        >
          Load more
        </button>
      )}
    </div>
  )
}
