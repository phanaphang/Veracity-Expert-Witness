import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import {
  LESSONS,
  TOTAL_LESSONS,
  getNextLesson,
  getLessonIndex,
  getUnitForLesson,
} from './courseData';
// unit object is used for scenarioId routing (suppress lint: used via getUnitForLesson return value)

const COMPLETE_DELAY_MS = 60 * 1000; // 60 seconds before "Mark Complete" appears

// Placeholder audio player — no real audio in v1
function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const toggle = () => {
    if (playing) {
      clearInterval(intervalRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(intervalRef.current);
            setPlaying(false);
            return 100;
          }
          return p + 0.5;
        });
      }, 150);
    }
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

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
          <div className="training-audio__bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="training-audio__time">
          {playing ? 'Playing…' : progress > 0 ? 'Paused' : 'Not started'}
        </span>
      </div>
      <p className="training-audio__note">Audio narration will be available in a future release.</p>
    </div>
  );
}

export default function LessonPage({ onProgressUpdate }) {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const lesson = LESSONS[lessonId];
  const unit = lesson ? getUnitForLesson(lessonId) : null;
  const lessonIndex = lesson ? getLessonIndex(lessonId) : 0;
  const nextLessonId = lesson ? getNextLesson(lessonId) : null;

  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef(null);
  const arrivedAt = useRef(Date.now());

  // Load existing completion status
  useEffect(() => {
    if (!user || !lessonId) return;
    const check = async () => {
      const { data } = await supabase
        .from('training_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();
      if (data?.completed) setAlreadyCompleted(true);
    };
    check();
  }, [user, lessonId]);

  // Start 60-second timer — show button after delay
  useEffect(() => {
    arrivedAt.current = Date.now();
    setCanComplete(false);

    timerRef.current = setTimeout(() => {
      setCanComplete(true);
    }, COMPLETE_DELAY_MS);

    return () => clearTimeout(timerRef.current);
  }, [lessonId]);

  const handleMarkComplete = async () => {
    if (!user) return;
    setCompleting(true);
    setError('');
    try {
      const now = new Date().toISOString();

      // Check if row already exists
      const { data: existing } = await supabase
        .from('training_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('training_progress')
          .update({ completed: true, completed_at: now })
          .eq('id', existing.id);
      } else {
        await supabase.from('training_progress').insert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: now,
        });
      }

      setAlreadyCompleted(true);
      if (onProgressUpdate) onProgressUpdate();

      // Navigate to next lesson or to the quiz for this unit
      if (nextLessonId) {
        const nextUnit = getUnitForLesson(nextLessonId);
        // Crossing a unit boundary — go to scenario (if unit has one) or quiz
        if (nextUnit && unit && nextUnit.id !== unit.id) {
          if (unit.scenarioId) {
            navigate(`/training/scenario/${unit.scenarioId}`);
          } else {
            navigate(`/training/quiz/${unit.quizId}`);
          }
        } else {
          navigate(`/training/lesson/${nextLessonId}`);
        }
      } else {
        // Last lesson in the course — go to scenario or quiz for its unit
        if (unit) {
          if (unit.scenarioId) {
            navigate(`/training/scenario/${unit.scenarioId}`);
          } else {
            navigate(`/training/quiz/${unit.quizId}`);
          }
        } else {
          navigate('/training');
        }
      }
    } catch (e) {
      console.error('Mark complete error', e);
      setError('Could not save progress. Please try again.');
    } finally {
      setCompleting(false);
    }
  };

  if (!lesson) {
    return (
      <div>
        <div className="portal-alert portal-alert--error">Lesson not found.</div>
        <Link to="/training" className="btn btn--secondary" style={{ marginTop: 16 }}>
          Back to Training
        </Link>
      </div>
    );
  }

  const progressPct = Math.round((lessonIndex / TOTAL_LESSONS) * 100);

  return (
    <div className="training-lesson">
      {/* Top progress bar */}
      <div className="training-lesson__course-progress">
        <div className="training-lesson__course-progress-bar" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Course progress">
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
        <div className="training-lesson__unit-badge">{unit?.title}</div>
        <h1 className="training-lesson__title">{lesson.title}</h1>
        <div className="training-lesson__meta">~{lesson.estimatedMinutes} min</div>
      </div>

      {/* Audio player placeholder */}
      <AudioPlayer />

      {/* Content */}
      <div className="training-lesson__content portal-card">
        <h2 className="training-lesson__heading">{lesson.heading}</h2>

        {lesson.body.map((para, i) => (
          <p key={i} className="training-lesson__para">{para}</p>
        ))}

        {lesson.bullets && lesson.bullets.length > 0 && (
          <ul className="training-lesson__bullets">
            {lesson.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}

        {/* Key Takeaway callout */}
        <div className="training-lesson__takeaway">
          <div className="training-lesson__takeaway-label">Key Takeaway</div>
          <p>{lesson.keyTakeaway}</p>
        </div>
      </div>

      {/* Completion action */}
      <div className="training-lesson__footer">
        {error && <div className="portal-alert portal-alert--error">{error}</div>}

        {alreadyCompleted ? (
          <div className="training-lesson__already-done">
            <svg viewBox="0 0 16 16" fill="none" width="18" height="18">
              <circle cx="8" cy="8" r="7" fill="var(--color-accent)" />
              <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Lesson complete.
            {nextLessonId && (
              <Link to={`/training/lesson/${nextLessonId}`} className="btn btn--primary" style={{ marginLeft: 16 }}>
                Next Lesson →
              </Link>
            )}
            {!nextLessonId && unit && (
              <Link to={`/training/quiz/${unit.quizId}`} className="btn btn--primary" style={{ marginLeft: 16 }}>
                Take Knowledge Check →
              </Link>
            )}
          </div>
        ) : canComplete ? (
          <button
            className="btn btn--primary training-lesson__complete-btn"
            onClick={handleMarkComplete}
            disabled={completing}
          >
            {completing ? 'Saving…' : 'Mark Complete & Continue →'}
          </button>
        ) : (
          <div className="training-lesson__waiting">
            Please read through the lesson. You can mark it complete shortly.
          </div>
        )}
      </div>

      {/* Back link */}
      <div style={{ marginTop: 24 }}>
        <Link to="/training" className="training-lesson__back">
          ← Training Home
        </Link>
      </div>
    </div>
  );
}
