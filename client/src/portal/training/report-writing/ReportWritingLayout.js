import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { supabase } from '../../../lib/supabase'
import ReportWritingSidebar from './ReportWritingSidebar'

export default function ReportWritingLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, idleWarning, resetIdleTimer } = useAuth()
  const menuBtnRef = useRef(null)

  const [completedLessons, setCompletedLessons] = useState([])
  const [scenarioComplete, setScenarioComplete] = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)

  const loadProgress = useCallback(async () => {
    if (!user) return
    try {
      const { data } = await supabase
        .from('report_writing_progress')
        .select('lesson_id, completed, quiz_score')
        .eq('user_id', user.id)

      if (!data) return

      const done = data
        .filter(
          (r) =>
            r.completed &&
            ['1', '2', '3', '4', '5', '6', '7', '8'].includes(r.lesson_id)
        )
        .map((r) => r.lesson_id)
      setCompletedLessons(done)

      const scenarioRow = data.find(
        (r) => r.lesson_id === 'scenario' && r.completed
      )
      setScenarioComplete(!!scenarioRow)

      const quizRow = data.find((r) => r.lesson_id === 'quiz')
      setQuizPassed((quizRow?.quiz_score?.score ?? 0) >= 6)
    } catch (e) {
      console.error('ReportWritingLayout: failed to load progress', e)
    }
  }, [user])

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  // Close sidebar on Escape key
  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false)
        menuBtnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  return (
    <div className="training-layout">
      {/* Mobile overlay */}
      <div
        className={`portal-overlay${sidebarOpen ? ' portal-overlay--visible' : ''}`}
        onClick={() => {
          setSidebarOpen(false)
          menuBtnRef.current?.focus()
        }}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={`training-sidebar-wrapper${sidebarOpen ? ' training-sidebar-wrapper--open' : ''}`}
      >
        <ReportWritingSidebar
          completedLessons={completedLessons}
          scenarioComplete={scenarioComplete}
          quizPassed={quizPassed}
          onNavigate={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content area */}
      <main className="training-main">
        {idleWarning && (
          <div className="portal-idle-warning" role="alert">
            <span>
              Your session will expire in 2 minutes due to inactivity.
            </span>
            <button
              className="portal-idle-warning__btn"
              onClick={resetIdleTimer}
            >
              Stay signed in
            </button>
          </div>
        )}

        <header className="portal-topbar">
          <button
            ref={menuBtnRef}
            className="portal-topbar__menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
            aria-expanded={sidebarOpen}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              width="28"
              height="28"
              aria-hidden="true"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span className="portal-topbar__title">Report Writing</span>
        </header>

        <div className="portal-content">
          {/* Pass loadProgress so lesson/quiz/scenario pages can refresh sidebar */}
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child, { onProgressUpdate: loadProgress })
              : child
          )}
        </div>
      </main>
    </div>
  )
}
