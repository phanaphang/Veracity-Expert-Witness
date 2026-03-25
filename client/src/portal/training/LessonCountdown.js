import React, { useState, useEffect, useRef } from 'react'

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function LessonCountdown({ durationMs = 60000, onComplete }) {
  const totalSeconds = Math.ceil(durationMs / 1000)
  const [remaining, setRemaining] = useState(totalSeconds)
  const intervalRef = useRef(null)

  useEffect(() => {
    setRemaining(totalSeconds)

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [totalSeconds])

  useEffect(() => {
    if (remaining === 0 && onComplete) {
      onComplete()
    }
  }, [remaining, onComplete])

  const progress = remaining / totalSeconds
  const dashoffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="training-countdown">
      <div className="training-countdown__ring-wrap">
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r={RADIUS}
            fill="none"
            stroke="var(--color-gray-100, #e5e7eb)"
            strokeWidth="4"
          />
          <circle
            cx="24"
            cy="24"
            r={RADIUS}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashoffset}
            className="training-countdown__circle"
          />
        </svg>
        <span className="training-countdown__seconds">{remaining}</span>
      </div>
      <p className="training-countdown__label">
        You can mark this lesson complete in {remaining}{' '}
        {remaining === 1 ? 'second' : 'seconds'}
      </p>
    </div>
  )
}
