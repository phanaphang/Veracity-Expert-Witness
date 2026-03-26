import React, { useState, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { formatName } from '../../utils/formatName'
import { useToast } from '../../contexts/ToastContext'

const WORK_TYPE_OPTIONS = [
  { value: 'review_report', label: 'Review/Report' },
  { value: 'deposition', label: 'Deposition' },
  { value: 'trial_testimony', label: 'Trial Testimony' },
]

const MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

const EMPTY_FORM = {
  hours: '',
  minutes: '0',
  description: '',
  work_type: 'review_report',
  task_id: '',
}

export default function CaseTimeTab({
  caseId,
  caseData,
  timeEntries,
  tasks,
  onTimeEntriesChange,
  profile,
}) {
  const toast = useToast()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const expertRates = useMemo(() => {
    if (!caseData?.assignedExpert) return null
    return {
      review_report:
        parseFloat(caseData.assignedExpert.rate_review_report) || 0,
      deposition: parseFloat(caseData.assignedExpert.rate_deposition) || 0,
      trial_testimony:
        parseFloat(caseData.assignedExpert.rate_trial_testimony) || 0,
    }
  }, [caseData])

  const summary = useMemo(() => {
    const byType = { review_report: 0, deposition: 0, trial_testimony: 0 }
    let totalMinutes = 0

    timeEntries.forEach((entry) => {
      const mins =
        (parseFloat(entry.hours) || 0) * 60 + (parseInt(entry.minutes) || 0)
      totalMinutes += mins
      if (byType[entry.work_type] !== undefined) {
        byType[entry.work_type] += mins
      }
    })

    const totalHours = totalMinutes / 60
    let totalCost = 0

    const breakdown = WORK_TYPE_OPTIONS.map((wt) => {
      const mins = byType[wt.value]
      const hrs = mins / 60
      const rate = expertRates ? expertRates[wt.value] : 0
      const cost = hrs * rate
      totalCost += cost
      return { label: wt.label, hours: hrs, rate, cost }
    })

    return { totalHours, totalCost, breakdown, totalMinutes }
  }, [timeEntries, expertRates])

  const logActivity = async (action, details) => {
    await supabase.from('case_activity_log').insert({
      case_id: caseId,
      actor: profile.id,
      action,
      details,
    })
  }

  const handleSave = async () => {
    const hrs = parseFloat(form.hours) || 0
    const mins = parseInt(form.minutes) || 0
    if (hrs === 0 && mins === 0) {
      toast.error('Please enter a time greater than 0.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        case_id: caseId,
        hours: hrs,
        minutes: mins,
        description: form.description.trim(),
        work_type: form.work_type,
        task_id: form.task_id || null,
        logged_by: profile.id,
      }
      const { error } = await supabase.from('case_time_entries').insert(payload)
      if (error) throw error
      await logActivity('time_logged', {
        hours: hrs,
        minutes: mins,
        work_type: form.work_type,
        description: form.description.trim(),
      })
      toast.success('Time logged.')
      setShowForm(false)
      setForm(EMPTY_FORM)
      onTimeEntriesChange()
    } catch (err) {
      toast.error('Failed to log time: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('case_time_entries')
        .delete()
        .eq('id', deleteTarget.id)
      if (error) throw error
      await logActivity('time_deleted', {
        hours: deleteTarget.hours,
        minutes: deleteTarget.minutes,
        work_type: deleteTarget.work_type,
      })
      toast.success('Time entry deleted.')
      setDeleteTarget(null)
      onTimeEntriesChange()
    } catch (err) {
      toast.error('Failed to delete: ' + err.message)
    } finally {
      setDeleting(false)
    }
  }

  const downloadCSV = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const res = await fetch(
        `/api/time-entries-export?caseId=${encodeURIComponent(caseId)}`,
        {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Export failed')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `case-${caseData?.case_number || caseId}-time-entries.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('CSV downloaded.')
    } catch (err) {
      toast.error('Failed to download CSV: ' + err.message)
    }
  }

  const formatDuration = (hours, minutes) => {
    const h = parseFloat(hours) || 0
    const m = parseInt(minutes) || 0
    return `${h}h ${m}m`
  }

  const getEntryCost = (entry) => {
    if (!expertRates) return null
    const totalHrs =
      (parseFloat(entry.hours) || 0) + (parseInt(entry.minutes) || 0) / 60
    const rate = expertRates[entry.work_type] || 0
    return totalHrs * rate
  }

  return (
    <div>
      {/* Billing Summary */}
      <div className="case-time-summary">
        <div className="case-time-summary__card">
          <div className="case-time-summary__label">Total Hours</div>
          <div className="case-time-summary__value">
            {summary.totalHours.toFixed(1)}h
          </div>
          <div className="case-time-summary__sub">
            {timeEntries.length} entries
          </div>
        </div>
        {summary.breakdown.map((b) => (
          <div key={b.label} className="case-time-summary__card">
            <div className="case-time-summary__label">{b.label}</div>
            <div className="case-time-summary__value">
              {b.hours.toFixed(1)}h
            </div>
            <div className="case-time-summary__sub">
              {expertRates
                ? `$${b.rate}/hr - $${b.cost.toFixed(2)}`
                : 'No rate set'}
            </div>
          </div>
        ))}
        <div className="case-time-summary__card">
          <div className="case-time-summary__label">Estimated Cost</div>
          <div className="case-time-summary__value">
            {expertRates ? `$${summary.totalCost.toFixed(2)}` : 'N/A'}
          </div>
          {!expertRates && (
            <div className="case-time-summary__sub">
              Assign an expert with rates set
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="case-tab-header">
        <span className="case-tab-header__count">
          {timeEntries.length} time entries
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {timeEntries.length > 0 && (
            <button className="portal-btn-action" onClick={downloadCSV}>
              Download CSV
            </button>
          )}
          <button
            className="btn btn--primary"
            onClick={() => setShowForm(true)}
          >
            Log Time
          </button>
        </div>
      </div>

      {/* Time Entries Table */}
      {timeEntries.length === 0 ? (
        <div className="portal-empty">
          <p className="portal-empty__text">
            No time entries yet. Click &quot;Log Time&quot; to add one.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="portal-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Work Type</th>
                <th>Duration</th>
                <th>Logged By</th>
                <th>Task</th>
                <th>Cost</th>
                <th style={{ width: 60 }} />
              </tr>
            </thead>
            <tbody>
              {timeEntries.map((entry) => {
                const cost = getEntryCost(entry)
                return (
                  <tr key={entry.id}>
                    <td>{new Date(entry.logged_at).toLocaleDateString()}</td>
                    <td>{entry.description || '-'}</td>
                    <td>
                      {WORK_TYPE_OPTIONS.find(
                        (w) => w.value === entry.work_type
                      )?.label || entry.work_type}
                    </td>
                    <td>{formatDuration(entry.hours, entry.minutes)}</td>
                    <td>{entry.logger ? formatName(entry.logger) : '-'}</td>
                    <td>{entry.task?.title || '-'}</td>
                    <td>{cost !== null ? `$${cost.toFixed(2)}` : 'N/A'}</td>
                    <td>
                      <button
                        className="portal-btn-action"
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          color: 'var(--color-error)',
                          borderColor: 'var(--color-error)',
                        }}
                        onClick={() => setDeleteTarget(entry)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Log Time Modal */}
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
            style={{ maxWidth: 480, width: '90%', padding: 24 }}
          >
            <h3 style={{ marginBottom: 16 }}>Log Time</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                <div>
                  <label className="portal-field__label">Hours</label>
                  <input
                    className="portal-field__input"
                    type="number"
                    min="0"
                    max="99"
                    value={form.hours}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, hours: e.target.value }))
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="portal-field__label">Minutes</label>
                  <select
                    className="portal-field__select"
                    value={form.minutes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, minutes: e.target.value }))
                    }
                  >
                    {MINUTE_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="portal-field__label">Work Type</label>
                <select
                  className="portal-field__select"
                  value={form.work_type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, work_type: e.target.value }))
                  }
                >
                  {WORK_TYPE_OPTIONS.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
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
              {tasks.length > 0 && (
                <div>
                  <label className="portal-field__label">
                    Related Task (optional)
                  </label>
                  <select
                    className="portal-field__select"
                    value={form.task_id}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, task_id: e.target.value }))
                    }
                  >
                    <option value="">None</option>
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                onClick={() => {
                  setShowForm(false)
                  setForm(EMPTY_FORM)
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="btn btn--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Log Time'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
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
            <h3 style={{ marginBottom: 12 }}>Delete Time Entry</h3>
            <p>
              Delete the entry for{' '}
              <strong>
                {formatDuration(deleteTarget.hours, deleteTarget.minutes)}
              </strong>{' '}
              logged on {new Date(deleteTarget.logged_at).toLocaleDateString()}?
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
