import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'

const PHASES = [
  { value: 'intake', label: 'Intake' },
  { value: 'records_review', label: 'Records Review' },
  { value: 'report_drafting', label: 'Report Drafting' },
  { value: 'report_review', label: 'Report Review' },
  { value: 'deposition_prep', label: 'Deposition Prep' },
  { value: 'trial_prep', label: 'Trial Prep' },
  { value: 'closed', label: 'Closed' },
]

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
  const [timeEntries, setTimeEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !id) return
    let cancelled = false

    const load = async () => {
      try {
        const [caseRes, timeRes] = await Promise.all([
          supabase
            .from('cases')
            .select(
              'case_number, title, description, status, case_phase, client, case_type, jurisdiction, additional_notes, specialties(name), manager:case_manager(first_name, last_name)'
            )
            .eq('id', id)
            .single(),
          supabase
            .from('case_time_entries')
            .select('hours, minutes, work_type')
            .eq('case_id', id),
        ])

        if (cancelled) return

        if (caseRes.error) {
          toast.error('Unable to load case details.')
          setLoading(false)
          return
        }

        setCaseData(caseRes.data)
        setTimeEntries(timeRes.data || [])
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

      <div className="portal-card">
        <h3 className="portal-card__title">Case Details</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-gray-400)',
                marginBottom: 4,
              }}
            >
              Client
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-700)' }}>
              {caseData.client || '-'}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-gray-400)',
                marginBottom: 4,
              }}
            >
              Type
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-700)' }}>
              {caseData.case_type?.replace('_', ' ') || '-'}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-gray-400)',
                marginBottom: 4,
              }}
            >
              Jurisdiction
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-700)' }}>
              {caseData.jurisdiction || '-'}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-gray-400)',
                marginBottom: 4,
              }}
            >
              Case Manager
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-700)' }}>
              {caseData.manager
                ? `${caseData.manager.first_name || ''} ${caseData.manager.last_name || ''}`.trim()
                : '-'}
            </div>
          </div>
        </div>
        {caseData.additional_notes && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-gray-400)',
                marginBottom: 4,
              }}
            >
              Additional Notes
            </div>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-gray-700)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {caseData.additional_notes}
            </p>
          </div>
        )}
      </div>

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
    </div>
  )
}
