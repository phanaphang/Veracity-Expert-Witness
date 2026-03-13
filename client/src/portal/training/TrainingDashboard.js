import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { UNITS, TOTAL_LESSONS } from './courseData';

export default function TrainingDashboard() {
  const { user, profile } = useAuth();

  const [completedLessons, setCompletedLessons] = useState([]);
  const [passedQuizzes, setPassedQuizzes] = useState({});
  const [certificateIssued, setCertificateIssued] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const { data } = await supabase
          .from('training_progress')
          .select('lesson_id, completed, quiz_scores, certificate_issued_at')
          .eq('user_id', user.id);

        if (!data) return;

        const done = data
          .filter((r) => r.completed && r.lesson_id)
          .map((r) => r.lesson_id);
        setCompletedLessons(done);

        const scores = {};
        data.forEach((row) => {
          if (row.quiz_scores && typeof row.quiz_scores === 'object') {
            Object.assign(scores, row.quiz_scores);
          }
          if (row.certificate_issued_at) setCertificateIssued(true);
        });
        setPassedQuizzes(scores);
      } catch (e) {
        console.error('TrainingDashboard load error', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const pct = Math.round((completedLessons.length / TOTAL_LESSONS) * 100);

  // Determine the next item the user should work on
  function getNextAction() {
    for (const unit of UNITS) {
      for (const lid of unit.lessons) {
        if (!completedLessons.includes(lid)) {
          return { type: 'lesson', id: lid, label: `Continue: Lesson ${lid}`, to: `/training/lesson/${lid}` };
        }
      }
      // All lessons in unit done — check quiz
      const quizPassed = (passedQuizzes[unit.quizId] || 0) >= 2;
      if (!quizPassed) {
        return { type: 'quiz', id: unit.quizId, label: `Take Knowledge Check: ${unit.title}`, to: `/training/quiz/${unit.quizId}` };
      }
    }
    // All lessons + quizzes done
    if (!certificateIssued) {
      return { type: 'assessment', id: 'final', label: 'Take Final Assessment', to: '/training/assessment' };
    }
    return { type: 'certificate', id: 'cert', label: 'View Your Certificate', to: '/training/certificate' };
  }

  const nextAction = getNextAction();

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">
          Expert Witness Foundations
        </h1>
        <p className="portal-page__subtitle">
          Welcome{profile?.first_name ? `, ${profile.first_name}` : ''}. Complete all 4 units to earn your certificate.
        </p>
      </div>

      {/* Overall progress */}
      <div className="portal-card training-progress-card">
        <div className="training-progress-card__header">
          <span className="training-progress-card__label">Overall Progress</span>
          <span className="training-progress-card__pct">{pct}%</span>
        </div>
        <div className="training-progress-bar">
          <div className="training-progress-bar__fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="training-progress-card__meta">
          {completedLessons.length} of {TOTAL_LESSONS} lessons complete · ~60 min total
        </div>
        {!loading && (
          <Link to={nextAction.to} className="btn btn--primary training-progress-card__cta">
            {nextAction.label}
          </Link>
        )}
      </div>

      {/* Unit cards */}
      <div className="training-units">
        {UNITS.map((unit, ui) => {
          const unitDone = unit.lessons.filter((l) => completedLessons.includes(l)).length;
          const unitTotal = unit.lessons.length;
          const quizPassed = (passedQuizzes[unit.quizId] || 0) >= 2;
          const firstLesson = unit.lessons[0];
          // Unit is accessible if it's unit 1, previous unit's quiz was passed, or user is admin/staff
          const prevUnit = ui > 0 ? UNITS[ui - 1] : null;
          const isAdminOrStaff = ['admin', 'staff'].includes(profile?.role);
          const accessible =
            isAdminOrStaff || !prevUnit || (passedQuizzes[prevUnit.quizId] || 0) >= 2;

          return (
            <div
              key={unit.id}
              className={`portal-card training-unit-card${!accessible ? ' training-unit-card--locked' : ''}`}
            >
              <div className="training-unit-card__header">
                <div>
                  <div className="training-unit-card__number">Unit {ui + 1}</div>
                  <h2 className="training-unit-card__title">{unit.title}</h2>
                </div>
                {quizPassed && (
                  <span className="portal-badge portal-badge--approved">Complete</span>
                )}
                {!accessible && (
                  <span className="portal-badge portal-badge--pending">Locked</span>
                )}
              </div>

              <div className="training-unit-card__meta">
                ~{unit.estimatedMinutes} min &middot; {unitTotal} lessons
              </div>

              {/* Mini lesson list */}
              <ul className="training-unit-card__lessons">
                {unit.lessons.map((lid) => {
                  const done = completedLessons.includes(lid);
                  return (
                    <li key={lid} className={`training-unit-card__lesson${done ? ' training-unit-card__lesson--done' : ''}`}>
                      {done ? (
                        <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                          <circle cx="8" cy="8" r="7" fill="var(--color-accent)" />
                          <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span className="training-unit-card__dot" />
                      )}
                      Lesson {lid}
                    </li>
                  );
                })}
              </ul>

              {accessible && (
                <Link
                  to={`/training/lesson/${firstLesson}`}
                  className="btn btn--secondary training-unit-card__btn"
                >
                  {unitDone === 0 ? 'Start Unit' : unitDone < unitTotal ? 'Continue' : quizPassed ? 'Review' : 'Take Knowledge Check'}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Resources link */}
      <div className="portal-card training-resources-card">
        <div className="training-resources-card__body">
          <div>
            <h3 className="training-resources-card__title">Downloadable Resources</h3>
            <p className="training-resources-card__sub">5 reference guides — available anytime</p>
          </div>
          <Link to="/training/resources" className="btn btn--secondary">
            View Resources
          </Link>
        </div>
      </div>

      {/* More modules */}
      <div className="portal-card training-resources-card">
        <div className="training-resources-card__body">
          <div>
            <h3 className="training-resources-card__title">More Training</h3>
            <p className="training-resources-card__sub">Standards of Admissibility: Frye, Kelly, and Daubert — ~20 min</p>
          </div>
          <Link to="/training/admissibility" className="btn btn--secondary">
            Start Module
          </Link>
        </div>
      </div>
    </div>
  );
}
