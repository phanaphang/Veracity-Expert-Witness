import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { LESSON_SEQUENCE } from './admissibilityData'

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" fill="var(--color-accent)" />
      <path
        d="M4.5 8l2.5 2.5 4.5-4.5"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="7"
        width="10"
        height="7"
        rx="2"
        stroke="var(--color-gray-400)"
        strokeWidth="1.5"
      />
      <path
        d="M5 7V5a3 3 0 016 0v2"
        stroke="var(--color-gray-400)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

const LESSON_LABELS = {
  1: 'The Landscape of Admissibility Standards',
  2: 'Frye & Kelly: General Acceptance in California',
  3: 'Daubert: The Federal Standard & Multi-Industry Application',
}

export default function AdmissibilitySidebar({
  completedLessons,
  scenarioComplete,
  quizPassed,
  onNavigate,
}) {
  const location = useLocation()
  const { profile } = useAuth()
  const isAdminOrStaff = ['admin', 'staff'].includes(profile?.role)

  const dashboardLink = ['admin', 'staff'].includes(profile?.role)
    ? '/admin/dashboard'
    : '/portal/dashboard'

  function isLessonUnlocked(lessonId) {
    if (isAdminOrStaff) return true
    if (lessonId === '1') return true
    const idx = LESSON_SEQUENCE.indexOf(lessonId)
    if (idx <= 0) return true
    const prev = LESSON_SEQUENCE[idx - 1]
    return completedLessons.includes(prev)
  }

  function isScenarioUnlocked() {
    if (isAdminOrStaff) return true
    return completedLessons.includes('3')
  }

  function isQuizUnlocked() {
    if (isAdminOrStaff) return true
    return scenarioComplete
  }

  function isCertificateUnlocked() {
    if (isAdminOrStaff) return true
    return quizPassed
  }

  const scenarioUnlocked = isScenarioUnlocked()
  const quizUnlocked = isQuizUnlocked()
  const certUnlocked = isCertificateUnlocked()

  const activeLesson = (id) =>
    location.pathname === `/training/admissibility/lesson/${id}`
  const activeScenario =
    location.pathname === '/training/admissibility/scenario'
  const activeQuiz = location.pathname === '/training/admissibility/quiz'
  const activeCert = location.pathname === '/training/admissibility/certificate'

  return (
    <nav className="training-sidebar" aria-label="Course navigation">
      <Link
        to="/training/admissibility"
        className="training-sidebar__brand"
        onClick={onNavigate}
      >
        <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--color-accent)" />
          <path
            d="M2 17l10 5 10-5"
            stroke="var(--color-accent)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M2 12l10 5 10-5"
            stroke="var(--color-accent)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <div>
          <div className="training-sidebar__brand-name">Veracity</div>
          <div className="training-sidebar__brand-sub">
            Standards of Admissibility
          </div>
        </div>
      </Link>

      <Link
        to={dashboardLink}
        className="training-sidebar__back"
        onClick={onNavigate}
      >
        ← Back to Dashboard
      </Link>

      <div className="training-sidebar__nav">
        {/* Lessons */}
        <div className="training-sidebar__unit">
          <div className="training-sidebar__unit-label">Lessons</div>

          {LESSON_SEQUENCE.map((lessonId) => {
            const unlocked = isLessonUnlocked(lessonId)
            const done = completedLessons.includes(lessonId)
            const active = activeLesson(lessonId)

            if (!unlocked) {
              return (
                <div
                  key={lessonId}
                  className="training-sidebar__lesson training-sidebar__lesson--locked"
                >
                  <LockIcon />
                  <span>Lesson {lessonId}</span>
                </div>
              )
            }

            return (
              <Link
                key={lessonId}
                to={`/training/admissibility/lesson/${lessonId}`}
                className={`training-sidebar__lesson${active ? ' training-sidebar__lesson--active' : ''}${done ? ' training-sidebar__lesson--done' : ''}`}
                onClick={onNavigate}
              >
                {done ? (
                  <CheckIcon />
                ) : (
                  <span className="training-sidebar__dot" />
                )}
                <span>
                  Lesson {lessonId}: {LESSON_LABELS[lessonId]}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Scenario */}
        <div className="training-sidebar__unit">
          <div className="training-sidebar__unit-label">Branching Scenario</div>

          {!scenarioUnlocked ? (
            <div className="training-sidebar__lesson training-sidebar__lesson--locked">
              <LockIcon />
              <span>The Challenge</span>
            </div>
          ) : (
            <Link
              to="/training/admissibility/scenario"
              className={`training-sidebar__lesson${activeScenario ? ' training-sidebar__lesson--active' : ''}${scenarioComplete ? ' training-sidebar__lesson--done' : ''}`}
              onClick={onNavigate}
            >
              {scenarioComplete ? (
                <CheckIcon />
              ) : (
                <span className="training-sidebar__dot training-sidebar__dot--quiz" />
              )}
              <span>The Challenge</span>
            </Link>
          )}
        </div>

        {/* Knowledge Check */}
        <div className="training-sidebar__unit">
          <div className="training-sidebar__unit-label">Knowledge Check</div>

          {!quizUnlocked ? (
            <div className="training-sidebar__quiz training-sidebar__lesson--locked">
              <LockIcon />
              <span>5-Question Quiz</span>
            </div>
          ) : (
            <Link
              to="/training/admissibility/quiz"
              className={`training-sidebar__quiz${activeQuiz ? ' training-sidebar__lesson--active' : ''}${quizPassed ? ' training-sidebar__lesson--done' : ''}`}
              onClick={onNavigate}
            >
              {quizPassed ? (
                <CheckIcon />
              ) : (
                <span className="training-sidebar__dot training-sidebar__dot--quiz" />
              )}
              <span>5-Question Quiz</span>
            </Link>
          )}
        </div>

        {/* Certificate */}
        <div className="training-sidebar__unit">
          <div className="training-sidebar__unit-label">Certificate</div>

          {!certUnlocked ? (
            <div className="training-sidebar__lesson training-sidebar__lesson--locked">
              <LockIcon />
              <span>Certificate of Completion</span>
            </div>
          ) : (
            <Link
              to="/training/admissibility/certificate"
              className={`training-sidebar__lesson${activeCert ? ' training-sidebar__lesson--active' : ''}`}
              onClick={onNavigate}
            >
              <span className="training-sidebar__dot" />
              <span>Certificate of Completion</span>
            </Link>
          )}
        </div>

        {/* Resources - always accessible */}
        <div className="training-sidebar__unit">
          <Link
            to="/training/admissibility/resources"
            className={`training-sidebar__lesson${location.pathname === '/training/admissibility/resources' ? ' training-sidebar__lesson--active' : ''}`}
            onClick={onNavigate}
          >
            <span className="training-sidebar__dot" />
            <span>Downloadable Resources</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
