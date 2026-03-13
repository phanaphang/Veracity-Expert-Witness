import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { LESSONS, LESSON_SEQUENCE } from './admissibilityData';

// Total completable steps: 3 lessons + 1 scenario + 1 quiz + 1 certificate
const TOTAL_STEPS = 6;

const LESSON_DESCRIPTIONS = {
  '1': 'Frye, Daubert, and Kelly — what they are, where they apply, and why they matter across all industries.',
  '2': 'Frye\'s origins, the Kelly three-prong test, the scope of Kelly/Frye in California, and Sargon.',
  '3': 'Daubert factors, Kumho Tire, Joiner, and a side-by-side comparison with Kelly.',
};

export default function AdmissibilityDashboard() {
  const { user, profile } = useAuth();

  const [completedLessons, setCompletedLessons] = useState([]);
  const [scenarioComplete, setScenarioComplete] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [certificateIssued, setCertificateIssued] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const { data } = await supabase
          .from('admissibility_progress')
          .select('lesson_id, completed, quiz_score, certificate_issued_at')
          .eq('user_id', user.id);

        if (!data) return;

        const done = data
          .filter((r) => r.completed && ['1', '2', '3'].includes(r.lesson_id))
          .map((r) => r.lesson_id);
        setCompletedLessons(done);

        const scenarioRow = data.find((r) => r.lesson_id === 'scenario' && r.completed);
        setScenarioComplete(!!scenarioRow);

        const quizRow = data.find((r) => r.lesson_id === 'quiz');
        const passed = (quizRow?.quiz_score?.score ?? 0) >= 4;
        setQuizPassed(passed);

        const certRow = data.find((r) => r.lesson_id === 'quiz' && r.certificate_issued_at);
        setCertificateIssued(!!certRow);
      } catch (e) {
        console.error('AdmissibilityDashboard load error', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const completedSteps =
    completedLessons.length +
    (scenarioComplete ? 1 : 0) +
    (quizPassed ? 1 : 0) +
    (certificateIssued ? 1 : 0);
  const pct = Math.round((completedSteps / TOTAL_STEPS) * 100);

  function getNextAction() {
    for (const lessonId of LESSON_SEQUENCE) {
      if (!completedLessons.includes(lessonId)) {
        const lesson = LESSONS[lessonId];
        return {
          label: `${completedLessons.length === 0 ? 'Start' : 'Continue'}: Lesson ${lessonId} — ${lesson.title}`,
          to: `/training/admissibility/lesson/${lessonId}`,
        };
      }
    }
    if (!scenarioComplete) {
      return { label: 'Start Branching Scenario: The Challenge', to: '/training/admissibility/scenario' };
    }
    if (!quizPassed) {
      return { label: 'Take Knowledge Check', to: '/training/admissibility/quiz' };
    }
    if (!certificateIssued) {
      return { label: 'Get Your Certificate', to: '/training/admissibility/certificate' };
    }
    return { label: 'View Your Certificate', to: '/training/admissibility/certificate' };
  }

  const nextAction = getNextAction();

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Standards of Admissibility: Frye, Kelly, and Daubert</h1>
        <p className="portal-page__subtitle">
          Welcome{profile?.first_name ? `, ${profile.first_name}` : ''}. Complete all 3 lessons,
          the branching scenario, and the knowledge check to earn your certificate.
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
          {completedSteps} of {TOTAL_STEPS} steps complete &middot; ~20 min total
        </div>
        {!loading && (
          <Link to={nextAction.to} className="btn btn--primary training-progress-card__cta">
            {nextAction.label}
          </Link>
        )}
      </div>

      {/* Lesson cards */}
      <div className="training-units">
        {LESSON_SEQUENCE.map((lessonId, idx) => {
          const lesson = LESSONS[lessonId];
          const done = completedLessons.includes(lessonId);
          const isAdminOrStaff = ['admin', 'staff'].includes(profile?.role);
          const prevLessonId = idx > 0 ? LESSON_SEQUENCE[idx - 1] : null;
          const accessible =
            isAdminOrStaff || !prevLessonId || completedLessons.includes(prevLessonId);

          return (
            <div
              key={lessonId}
              className={`portal-card training-unit-card${!accessible ? ' training-unit-card--locked' : ''}`}
            >
              <div className="training-unit-card__header">
                <div>
                  <div className="training-unit-card__number">Lesson {lessonId}</div>
                  <h2 className="training-unit-card__title">{lesson.title}</h2>
                </div>
                {done && (
                  <span className="portal-badge portal-badge--approved">Complete</span>
                )}
                {!accessible && (
                  <span className="portal-badge portal-badge--pending">Locked</span>
                )}
              </div>

              <div className="training-unit-card__meta">
                ~{lesson.estimatedMinutes} min &middot; {lesson.sections.length} sections
              </div>

              <p style={{ color: 'var(--color-gray-500)', fontSize: 14, margin: '8px 0 16px' }}>
                {LESSON_DESCRIPTIONS[lessonId]}
              </p>

              {accessible && (
                <Link
                  to={`/training/admissibility/lesson/${lessonId}`}
                  className="btn btn--secondary training-unit-card__btn"
                >
                  {done ? 'Review' : 'Start Lesson'}
                </Link>
              )}
            </div>
          );
        })}

        {/* Scenario card */}
        {(() => {
          const isAdminOrStaff = ['admin', 'staff'].includes(profile?.role);
          const accessible = isAdminOrStaff || completedLessons.includes('3');
          return (
            <div
              className={`portal-card training-unit-card${!accessible ? ' training-unit-card--locked' : ''}`}
            >
              <div className="training-unit-card__header">
                <div>
                  <div className="training-unit-card__number">Scenario</div>
                  <h2 className="training-unit-card__title">The Challenge</h2>
                </div>
                {scenarioComplete && (
                  <span className="portal-badge portal-badge--approved">Complete</span>
                )}
                {!accessible && (
                  <span className="portal-badge portal-badge--pending">Locked</span>
                )}
              </div>
              <div className="training-unit-card__meta">~5 min &middot; Branching scenario</div>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 14, margin: '8px 0 16px' }}>
                Apply your knowledge to a real-world admissibility challenge — two decision points,
                immediate feedback, and practical takeaways.
              </p>
              {accessible && (
                <Link
                  to="/training/admissibility/scenario"
                  className="btn btn--secondary training-unit-card__btn"
                >
                  {scenarioComplete ? 'Review' : 'Start Scenario'}
                </Link>
              )}
            </div>
          );
        })()}

        {/* Quiz card */}
        {(() => {
          const isAdminOrStaff = ['admin', 'staff'].includes(profile?.role);
          const accessible = isAdminOrStaff || scenarioComplete;
          return (
            <div
              className={`portal-card training-unit-card${!accessible ? ' training-unit-card--locked' : ''}`}
            >
              <div className="training-unit-card__header">
                <div>
                  <div className="training-unit-card__number">Knowledge Check</div>
                  <h2 className="training-unit-card__title">5-Question Quiz</h2>
                </div>
                {quizPassed && (
                  <span className="portal-badge portal-badge--approved">Passed</span>
                )}
                {!accessible && (
                  <span className="portal-badge portal-badge--pending">Locked</span>
                )}
              </div>
              <div className="training-unit-card__meta">~5 min &middot; Pass score: 4 out of 5</div>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 14, margin: '8px 0 16px' }}>
                Covers all three lessons — jurisdiction, Kelly, Daubert, and multi-industry
                application. One retry allowed.
              </p>
              {accessible && (
                <Link
                  to="/training/admissibility/quiz"
                  className="btn btn--secondary training-unit-card__btn"
                >
                  {quizPassed ? 'Review' : 'Take Quiz'}
                </Link>
              )}
            </div>
          );
        })()}
      </div>

      {/* Resources link */}
      <div className="portal-card training-resources-card">
        <div className="training-resources-card__body">
          <div>
            <h3 className="training-resources-card__title">Downloadable Resources</h3>
            <p className="training-resources-card__sub">
              4 reference guides — quick reference, checklists, preparation guides, and module
              summary
            </p>
          </div>
          <Link to="/training/admissibility/resources" className="btn btn--secondary">
            View Resources
          </Link>
        </div>
      </div>

      {/* Back to Training Home */}
      <div style={{ marginTop: 24 }}>
        <Link to="/training" className="training-lesson__back">
          ← Back to Training Home
        </Link>
      </div>
    </div>
  );
}
