import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import { TOTAL_LESSONS } from '../training/courseData'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const { error: toastError } = useToast()
  const [stats, setStats] = useState({
    pendingCases: 0,
    unreadMessages: 0,
    documents: 0,
  })
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [hasCv, setHasCv] = useState(false)
  const [loading, setLoading] = useState(true)
  const [trainingPct, setTrainingPct] = useState(null)
  const [admissibilityPct, setAdmissibilityPct] = useState(null)
  const [reportWritingPct, setReportWritingPct] = useState(null)
  const [depositionPct, setDepositionPct] = useState(null)
  const [trialTestimonyPct, setTrialTestimonyPct] = useState(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const load = async () => {
      try {
        const now = new Date().toISOString()
        const weekOut = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString()
        const [
          cases,
          msgs,
          docs,
          events,
          training,
          admissibility,
          reportWriting,
          deposition,
          trialTestimony,
        ] = await Promise.all([
          supabase
            .from('case_invitations')
            .select('*', { count: 'exact', head: true })
            .eq('expert_id', user.id)
            .eq('status', 'pending'),
          supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', user.id)
            .eq('is_read', false),
          supabase
            .from('documents')
            .select('document_type')
            .eq('expert_id', user.id),
          supabase
            .from('calendar_events')
            .select('id, title, start_time')
            .eq('expert_id', user.id)
            .gte('start_time', now)
            .lte('start_time', weekOut)
            .order('start_time', { ascending: true })
            .limit(5),
          supabase
            .from('training_progress')
            .select('lesson_id, completed')
            .eq('user_id', user.id),
          supabase
            .from('admissibility_progress')
            .select('lesson_id, completed, quiz_score')
            .eq('user_id', user.id),
          supabase
            .from('report_writing_progress')
            .select('lesson_id, completed, quiz_score')
            .eq('user_id', user.id),
          supabase
            .from('deposition_progress')
            .select('lesson_id, completed, quiz_score')
            .eq('user_id', user.id),
          supabase
            .from('trial_testimony_progress')
            .select('lesson_id, completed, quiz_score')
            .eq('user_id', user.id),
        ])
        if (cancelled) return
        setStats({
          pendingCases: cases.count || 0,
          unreadMessages: msgs.count || 0,
          documents: docs.data?.length || 0,
        })
        setUpcomingEvents(events.data || [])
        if (docs.data?.some((d) => d.document_type === 'cv')) setHasCv(true)
        const completedCount =
          training.data?.filter((r) => r.completed && r.lesson_id).length || 0
        setTrainingPct(Math.round((completedCount / TOTAL_LESSONS) * 100))
        // Admissibility: 3 lessons + scenario + quiz = 5 completable steps
        if (admissibility.data) {
          const adLessons = admissibility.data.filter(
            (r) => r.completed && ['1', '2', '3'].includes(r.lesson_id)
          ).length
          const adScenario = admissibility.data.some(
            (r) => r.lesson_id === 'scenario' && r.completed
          )
            ? 1
            : 0
          const adQuiz = admissibility.data.some(
            (r) => r.lesson_id === 'quiz' && (r.quiz_score?.score ?? 0) >= 4
          )
            ? 1
            : 0
          setAdmissibilityPct(
            Math.round(((adLessons + adScenario + adQuiz) / 5) * 100)
          )
        }
        // Report Writing: 8 lessons + scenario + quiz = 10 completable steps
        if (reportWriting.data) {
          const rwLessons = reportWriting.data.filter(
            (r) =>
              r.completed &&
              ['1', '2', '3', '4', '5', '6', '7', '8'].includes(r.lesson_id)
          ).length
          const rwScenario = reportWriting.data.some(
            (r) => r.lesson_id === 'scenario' && r.completed
          )
            ? 1
            : 0
          const rwQuiz = reportWriting.data.some(
            (r) => r.lesson_id === 'quiz' && (r.quiz_score?.score ?? 0) >= 6
          )
            ? 1
            : 0
          setReportWritingPct(
            Math.round(((rwLessons + rwScenario + rwQuiz) / 10) * 100)
          )
        }
        // Deposition: 8 lessons + scenario + quiz = 10 completable steps
        if (deposition.data) {
          const dpLessons = deposition.data.filter(
            (r) =>
              r.completed &&
              ['1', '2', '3', '4', '5', '6', '7', '8'].includes(r.lesson_id)
          ).length
          const dpScenario = deposition.data.some(
            (r) => r.lesson_id === 'scenario' && r.completed
          )
            ? 1
            : 0
          const dpQuiz = deposition.data.some(
            (r) => r.lesson_id === 'quiz' && (r.quiz_score?.score ?? 0) >= 6
          )
            ? 1
            : 0
          setDepositionPct(
            Math.round(((dpLessons + dpScenario + dpQuiz) / 10) * 100)
          )
        }
        // Trial Testimony: 10 lessons + scenario + quiz = 12 completable steps
        if (trialTestimony.data) {
          const ttLessons = trialTestimony.data.filter(
            (r) =>
              r.completed &&
              ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(
                r.lesson_id
              )
          ).length
          const ttScenario = trialTestimony.data.some(
            (r) => r.lesson_id === 'scenario' && r.completed
          )
            ? 1
            : 0
          const ttQuiz = trialTestimony.data.some(
            (r) => r.lesson_id === 'quiz' && (r.quiz_score?.score ?? 0) >= 8
          )
            ? 1
            : 0
          setTrialTestimonyPct(
            Math.round(((ttLessons + ttScenario + ttQuiz) / 12) * 100)
          )
        }
        setLoading(false)
      } catch (e) {
        console.error('Dashboard load error', e)
        toastError('Failed to load dashboard data')
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user, toastError])

  const profileComplete =
    profile?.first_name && profile?.last_name && profile?.bio

  return (
    <div>
      <div className="portal-page__header">
        <div>
          <h1 className="portal-page__title">
            Welcome{profile?.first_name ? `, ${profile.first_name}` : ''}
          </h1>
          <p className="portal-page__subtitle">
            Here&apos;s an overview of your account
          </p>
        </div>
      </div>

      {!profileComplete && (
        <div
          className="portal-alert portal-alert--error"
          style={{ marginBottom: 24 }}
        >
          Your profile is incomplete.{' '}
          <Link to="/portal/profile" style={{ fontWeight: 600 }}>
            Complete your profile
          </Link>{' '}
          to be eligible for case invitations.
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 16,
        }}
      >
        <Link
          to="/portal/profile"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
              Edit Profile
            </h3>
            {!hasCv && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  marginLeft: 8,
                }}
              >
                CV missing
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gray-500)',
              marginTop: 8,
            }}
          >
            Update your credentials, specialties, and availability
          </p>
          {!hasCv && (
            <p
              style={{
                fontSize: '0.78rem',
                color: '#ef4444',
                marginTop: 6,
                fontWeight: 600,
              }}
            >
              Upload your CV / Resume →
            </p>
          )}
        </Link>
        <Link
          to="/portal/documents"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
              Documents
            </h3>
            {!loading && (
              <span
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  marginLeft: 8,
                }}
              >
                {stats.documents} uploaded
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gray-500)',
              marginTop: 8,
            }}
          >
            Upload your licenses and certifications
          </p>
        </Link>
        <Link
          to="/portal/cases"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
              Case Invitations
            </h3>
            {!loading && stats.pendingCases > 0 && (
              <span
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  marginLeft: 8,
                }}
              >
                {stats.pendingCases} pending
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gray-500)',
              marginTop: 8,
            }}
          >
            View and respond to case opportunities
          </p>
        </Link>
        <Link
          to="/portal/messages"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
              Messages
            </h3>
            {!loading && stats.unreadMessages > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  marginLeft: 8,
                }}
              >
                {stats.unreadMessages} unread
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gray-500)',
              marginTop: 8,
            }}
          >
            View and send messages
          </p>
        </Link>
      </div>

      <h3
        style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: 'var(--color-navy)',
          margin: '24px 0 12px',
        }}
      >
        Training Modules
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        <Link
          to="/training"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
              Expert Witness Foundations
            </h3>
            {trainingPct !== null && (
              <span
                style={{
                  background:
                    trainingPct === 100 ? '#16a34a' : 'var(--color-accent)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  marginLeft: 8,
                }}
              >
                {trainingPct === 100 ? 'Complete' : `${trainingPct}%`}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gray-500)',
              marginTop: 8,
            }}
          >
            ~60 min · 4 units · 10 lessons
          </p>
        </Link>
        <Link
          to="/training/admissibility"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
              Standards of Admissibility
            </h3>
            {admissibilityPct !== null && (
              <span
                style={{
                  background:
                    admissibilityPct === 100
                      ? '#16a34a'
                      : 'var(--color-accent)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  marginLeft: 8,
                }}
              >
                {admissibilityPct === 100 ? 'Complete' : `${admissibilityPct}%`}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gray-500)',
              marginTop: 8,
            }}
          >
            ~30 min · Frye, Kelly, and Daubert
          </p>
        </Link>
        <Link
          to="/training/report-writing"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
              Report Writing
            </h3>
            {reportWritingPct !== null && (
              <span
                style={{
                  background:
                    reportWritingPct === 100
                      ? '#16a34a'
                      : 'var(--color-accent)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  marginLeft: 8,
                }}
              >
                {reportWritingPct === 100 ? 'Complete' : `${reportWritingPct}%`}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gray-500)',
              marginTop: 8,
            }}
          >
            ~60 min · Writing a defensible expert report
          </p>
        </Link>
        <Link
          to="/training/deposition"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
              Deposition
            </h3>
            {depositionPct !== null && (
              <span
                style={{
                  background:
                    depositionPct === 100 ? '#16a34a' : 'var(--color-accent)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  marginLeft: 8,
                }}
              >
                {depositionPct === 100 ? 'Complete' : `${depositionPct}%`}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gray-500)',
              marginTop: 8,
            }}
          >
            ~60 min · Expert deposition skills
          </p>
        </Link>
        <Link
          to="/training/trial-testimony"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
              Trial Testimony
            </h3>
            {trialTestimonyPct !== null && (
              <span
                style={{
                  background:
                    trialTestimonyPct === 100
                      ? '#16a34a'
                      : 'var(--color-accent)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  marginLeft: 8,
                }}
              >
                {trialTestimonyPct === 100
                  ? 'Complete'
                  : `${trialTestimonyPct}%`}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gray-500)',
              marginTop: 8,
            }}
          >
            ~75 min · Courtroom testimony skills
          </p>
        </Link>
      </div>

      <div className="portal-card" style={{ marginTop: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <h3 className="portal-card__title" style={{ marginBottom: 0 }}>
            My 30-Day Horizon
          </h3>
          <Link
            to="/portal/calendar"
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-accent)',
              fontWeight: 600,
            }}
          >
            View Calendar →
          </Link>
        </div>
        {upcomingEvents.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-400)' }}>
            No events in the next 30 days.{' '}
            <Link
              to="/portal/calendar"
              style={{ color: 'var(--color-accent)' }}
            >
              Add one →
            </Link>
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="cal-upcoming-event">
                <div className="cal-upcoming-event__dot" />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: 'var(--color-navy)',
                    }}
                  >
                    {ev.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--color-gray-500)',
                    }}
                  >
                    {new Date(ev.start_time).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {' · '}
                    {new Date(ev.start_time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
