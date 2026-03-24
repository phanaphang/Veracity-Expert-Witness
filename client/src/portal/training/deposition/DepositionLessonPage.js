import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { supabase } from '../../../lib/supabase'
import {
  LESSONS,
  TOTAL_LESSONS,
  getNextLesson,
  getLessonIndex,
  MODULE_TITLE,
} from './depositionData'

const COMPLETE_DELAY_MS = 60 * 1000 // 60 seconds before "Mark Complete" appears

// Placeholder audio player - no real audio in v1
function AudioPlayer() {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)

  const toggle = () => {
    if (playing) {
      clearInterval(intervalRef.current)
      setPlaying(false)
    } else {
      setPlaying(true)
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(intervalRef.current)
            setPlaying(false)
            return 100
          }
          return p + 0.5
        })
      }, 150)
    }
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div className="training-audio">
      <div className="training-audio__label">Audio Lesson (placeholder)</div>
      <div className="training-audio__controls">
        <button
          className={`training-audio__play${playing ? ' training-audio__play--active' : ''}`}
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className="training-audio__bar">
          <div
            className="training-audio__bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="training-audio__time">
          {playing ? 'Playing...' : progress > 0 ? 'Paused' : 'Not started'}
        </span>
      </div>
      <p className="training-audio__note">
        Audio narration will be available in a future release.
      </p>
    </div>
  )
}

// Renders the rich content sections defined in depositionData.js
function LessonSection({ section }) {
  return (
    <div className="training-lesson__section">
      {section.subheading && (
        <h3 className="training-lesson__subheading">{section.subheading}</h3>
      )}

      {section.body.map((para, i) => (
        <p key={i} className="training-lesson__para">
          {para}
        </p>
      ))}

      {section.bullets && section.bullets.length > 0 && (
        <ul className="training-lesson__bullets">
          {section.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}

      {section.numberedList && section.numberedList.length > 0 && (
        <ol className="training-lesson__bullets">
          {section.numberedList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      )}

      {section.afterList && (
        <p className="training-lesson__para">{section.afterList}</p>
      )}

      {section.comparisonTable && section.comparisonTable.length > 0 && (
        <div style={{ overflowX: 'auto', margin: '16px 0' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          >
            <thead>
              <tr>
                {Object.keys(section.comparisonTable[0]).map((key) => (
                  <th
                    key={key}
                    style={{
                      background: '#1a1f3a',
                      color: '#fff',
                      padding: '10px 14px',
                      textAlign: 'left',
                      border: '1px solid #e5e7eb',
                      minWidth: 130,
                      fontWeight: 600,
                    }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.comparisonTable.map((row, i) => (
                <tr
                  key={i}
                  style={{ background: i % 2 === 0 ? '#f9fafb' : '#ffffff' }}
                >
                  {Object.values(row).map((val, j) => (
                    <td
                      key={j}
                      style={{
                        padding: '10px 14px',
                        border: '1px solid #e5e7eb',
                        color: j === 0 ? '#1a1f3a' : '#374151',
                        fontWeight: j === 0 ? 600 : 400,
                        verticalAlign: 'top',
                      }}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function DepositionLessonPage({ onProgressUpdate }) {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const lesson = LESSONS[lessonId]
  const lessonIndex = lesson ? getLessonIndex(lessonId) : 0
  const nextLessonId = lesson ? getNextLesson(lessonId) : null

  const [alreadyCompleted, setAlreadyCompleted] = useState(false)
  const [canComplete, setCanComplete] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState('')
  const timerRef = useRef(null)
  const arrivedAt = useRef(Date.now())

  // Load existing completion status
  useEffect(() => {
    if (!user || !lessonId) return
    setAlreadyCompleted(false)
    const check = async () => {
      const { data } = await supabase
        .from('deposition_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle()
      if (data?.completed) setAlreadyCompleted(true)
    }
    check()
  }, [user, lessonId])

  // 60-second timer before "Mark Complete" button appears
  useEffect(() => {
    arrivedAt.current = Date.now()
    setCanComplete(false)

    timerRef.current = setTimeout(() => {
      setCanComplete(true)
    }, COMPLETE_DELAY_MS)

    return () => clearTimeout(timerRef.current)
  }, [lessonId])

  const handleMarkComplete = async () => {
    if (!user) return
    setCompleting(true)
    setError('')
    try {
      const now = new Date().toISOString()

      const { data: existing } = await supabase
        .from('deposition_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('deposition_progress')
          .update({ completed: true, completed_at: now })
          .eq('id', existing.id)
      } else {
        await supabase.from('deposition_progress').insert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: now,
        })
      }

      setAlreadyCompleted(true)
      if (onProgressUpdate) onProgressUpdate()

      if (nextLessonId) {
        navigate(`/training/deposition/lesson/${nextLessonId}`)
      } else {
        // Last lesson - go to scenario
        navigate('/training/deposition/scenario')
      }
    } catch (e) {
      console.error('Mark complete error', e)
      setError('Could not save progress. Please try again.')
    } finally {
      setCompleting(false)
    }
  }

  if (!lesson) {
    return (
      <div>
        <div className="portal-alert portal-alert--error">
          Lesson not found.
        </div>
        <Link
          to="/training/deposition"
          className="btn btn--secondary"
          style={{ marginTop: 16 }}
        >
          Back to Training
        </Link>
      </div>
    )
  }

  const progressPct = Math.round((lessonIndex / TOTAL_LESSONS) * 100)

  return (
    <div className="training-lesson">
      {/* Top progress bar */}
      <div className="training-lesson__course-progress">
        <div
          className="training-lesson__course-progress-bar"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Course progress"
        >
          <div
            className="training-lesson__course-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="training-lesson__course-progress-label">
          Lesson {lessonIndex} of {TOTAL_LESSONS}
        </span>
      </div>

      {/* Header */}
      <div className="training-lesson__header">
        <div className="training-lesson__unit-badge">{MODULE_TITLE}</div>
        <h1 className="training-lesson__title">{lesson.title}</h1>
        <div className="training-lesson__meta">
          ~{lesson.estimatedMinutes} min
        </div>
      </div>

      {/* Audio player placeholder */}
      <AudioPlayer />

      {/* Content */}
      <div className="training-lesson__content portal-card">
        {lesson.sections.map((section, i) => (
          <LessonSection key={i} section={section} />
        ))}

        {/* Key Takeaway callout */}
        <div className="training-lesson__takeaway">
          <div className="training-lesson__takeaway-label">Key Takeaway</div>
          <p>{lesson.keyTakeaway}</p>
        </div>
      </div>

      {/* Completion action */}
      <div className="training-lesson__footer">
        {error && (
          <div className="portal-alert portal-alert--error">{error}</div>
        )}

        {alreadyCompleted ? (
          <div className="training-lesson__already-done">
            <svg viewBox="0 0 16 16" fill="none" width="18" height="18">
              <circle cx="8" cy="8" r="7" fill="var(--color-accent)" />
              <path
                d="M4.5 8l2.5 2.5 4.5-4.5"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Lesson complete.
            {nextLessonId && (
              <Link
                to={`/training/deposition/lesson/${nextLessonId}`}
                className="btn btn--primary"
                style={{ marginLeft: 16 }}
              >
                Next Lesson &rarr;
              </Link>
            )}
            {!nextLessonId && (
              <Link
                to="/training/deposition/scenario"
                className="btn btn--primary"
                style={{ marginLeft: 16 }}
              >
                Continue to Scenario &rarr;
              </Link>
            )}
          </div>
        ) : canComplete ? (
          <button
            className="btn btn--primary training-lesson__complete-btn"
            onClick={handleMarkComplete}
            disabled={completing}
          >
            {completing ? 'Saving...' : 'Mark Complete & Continue \u2192'}
          </button>
        ) : (
          <div className="training-lesson__waiting">
            Please read through the lesson. You can mark it complete shortly.
          </div>
        )}
      </div>

      {/* Back link */}
      <div style={{ marginTop: 24 }}>
        <Link to="/training/deposition" className="training-lesson__back">
          &larr; Training Home
        </Link>
      </div>
    </div>
  )
}
