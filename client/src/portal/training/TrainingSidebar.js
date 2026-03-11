import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UNITS, LESSON_SEQUENCE } from './courseData';

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="var(--color-accent)" />
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="2" stroke="var(--color-gray-400)" strokeWidth="1.5" />
      <path d="M5 7V5a3 3 0 016 0v2" stroke="var(--color-gray-400)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function TrainingSidebar({ completedLessons, passedQuizzes, onNavigate }) {
  const location = useLocation();

  // A lesson is unlocked if it's '1.1' or all previous lessons are complete
  function isLessonUnlocked(lessonId) {
    if (lessonId === '1.1') return true;
    const idx = LESSON_SEQUENCE.indexOf(lessonId);
    if (idx <= 0) return true;
    const prev = LESSON_SEQUENCE[idx - 1];
    return completedLessons.includes(prev);
  }

  // A unit's quiz is unlocked when all lessons in that unit are complete
  function isQuizUnlocked(unit) {
    return unit.lessons.every((lid) => completedLessons.includes(lid));
  }

  return (
    <nav className="training-sidebar" aria-label="Course navigation">
      <Link to="/training" className="training-sidebar__brand" onClick={onNavigate}>
        <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--color-accent)" />
          <path d="M2 17l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
          <path d="M2 12l10 5 10-5" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
        </svg>
        <div>
          <div className="training-sidebar__brand-name">Veracity</div>
          <div className="training-sidebar__brand-sub">Expert Witness Foundations</div>
        </div>
      </Link>

      <Link
        to="/portal/dashboard"
        className="training-sidebar__back"
        onClick={onNavigate}
      >
        ← Back to Dashboard
      </Link>

      <div className="training-sidebar__nav">
        {UNITS.map((unit) => (
          <div key={unit.id} className="training-sidebar__unit">
            <div className="training-sidebar__unit-label">{unit.title}</div>

            {unit.lessons.map((lessonId) => {
              const unlocked = isLessonUnlocked(lessonId);
              const done = completedLessons.includes(lessonId);
              const active = location.pathname === `/training/lesson/${lessonId}`;

              if (!unlocked) {
                return (
                  <div key={lessonId} className="training-sidebar__lesson training-sidebar__lesson--locked">
                    <LockIcon />
                    <span>Lesson {lessonId}</span>
                  </div>
                );
              }

              return (
                <Link
                  key={lessonId}
                  to={`/training/lesson/${lessonId}`}
                  className={`training-sidebar__lesson${active ? ' training-sidebar__lesson--active' : ''}${done ? ' training-sidebar__lesson--done' : ''}`}
                  onClick={onNavigate}
                >
                  {done ? <CheckIcon /> : <span className="training-sidebar__dot" />}
                  <span>Lesson {lessonId}</span>
                </Link>
              );
            })}

            {/* Knowledge check link */}
            {(() => {
              const quizUnlocked = isQuizUnlocked(unit);
              const quizPassed = passedQuizzes.includes(unit.quizId);
              const activeQuiz = location.pathname === `/training/quiz/${unit.quizId}`;

              if (!quizUnlocked) {
                return (
                  <div className="training-sidebar__quiz training-sidebar__lesson--locked">
                    <LockIcon />
                    <span>Knowledge Check</span>
                  </div>
                );
              }

              return (
                <Link
                  to={`/training/quiz/${unit.quizId}`}
                  className={`training-sidebar__quiz${activeQuiz ? ' training-sidebar__lesson--active' : ''}${quizPassed ? ' training-sidebar__lesson--done' : ''}`}
                  onClick={onNavigate}
                >
                  {quizPassed ? <CheckIcon /> : <span className="training-sidebar__dot training-sidebar__dot--quiz" />}
                  <span>Knowledge Check</span>
                </Link>
              );
            })()}
          </div>
        ))}

        {/* Final assessment */}
        <div className="training-sidebar__unit">
          <div className="training-sidebar__unit-label">Final Step</div>
          <Link
            to="/training/assessment"
            className={`training-sidebar__lesson${location.pathname === '/training/assessment' ? ' training-sidebar__lesson--active' : ''}`}
            onClick={onNavigate}
          >
            <span className="training-sidebar__dot" />
            <span>Final Assessment</span>
          </Link>
          <Link
            to="/training/certificate"
            className={`training-sidebar__lesson${location.pathname === '/training/certificate' ? ' training-sidebar__lesson--active' : ''}`}
            onClick={onNavigate}
          >
            <span className="training-sidebar__dot" />
            <span>Certificate</span>
          </Link>
          <Link
            to="/training/resources"
            className={`training-sidebar__lesson${location.pathname === '/training/resources' ? ' training-sidebar__lesson--active' : ''}`}
            onClick={onNavigate}
          >
            <span className="training-sidebar__dot" />
            <span>Resources</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
