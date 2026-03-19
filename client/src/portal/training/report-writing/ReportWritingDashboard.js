import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { LESSONS, LESSON_SEQUENCE } from './reportWritingData';

// Total completable steps: 8 lessons + 1 scenario + 1 quiz + 1 certificate
const TOTAL_STEPS = 11;

const LESSON_DESCRIPTIONS = {
  '1': 'Who reads your report, why each audience matters, and the disclosure requirements that shape what you write.',
  '2': 'The ten essential sections of a defensible expert report and industry-specific structural variations.',
  '3': 'Stating opinions with clarity, specificity, and defensibility. Facts vs. assumptions vs. opinions.',
  '4': 'What to list, what to omit, and how to survive the deposition questions about your materials.',
  '5': 'Documenting methodology, citing authoritative sources, and handling data gaps.',
  '6': 'Every sentence you write will be read back to you under oath. Write with deposition in mind.',
  '7': 'Consistent formatting, numbered exhibits, tables, appendices, and the final proofread checklist.',
  '8': 'Advocacy language, draft protections, consistency, and the most common errors that get reports challenged.',
};

export default function ReportWritingDashboard() {
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
          .from('report_writing_progress')
          .select('lesson_id, completed, quiz_score, certificate_issued_at')
          .eq('user_id', user.id);

        if (!data) return;

        const done = data
          .filter((r) => r.completed && ['1', '2', '3', '4', '5', '6', '7', '8'].includes(r.lesson_id))
          .map((r) => r.lesson_id);
        setCompletedLessons(done);

        const scenarioRow = data.find((r) => r.lesson_id === 'scenario' && r.completed);
        setScenarioComplete(!!scenarioRow);

        const quizRow = data.find((r) => r.lesson_id === 'quiz');
        const passed = (quizRow?.quiz_score?.score ?? 0) >= 6;
        setQuizPassed(passed);

        const certRow = data.find((r) => r.lesson_id === 'quiz' && r.certificate_issued_at);
        setCertificateIssued(!!certRow);
      } catch (e) {
        console.error('ReportWritingDashboard load error', e);
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
          label: `${completedLessons.length === 0 ? 'Start' : 'Continue'}: Lesson ${lessonId} - ${lesson.title}`,
          to: `/training/report-writing/lesson/${lessonId}`,
        };
      }
    }
    if (!scenarioComplete) {
      return { label: 'Start Branching Scenario: The Draft Review', to: '/training/report-writing/scenario' };
    }
    if (!quizPassed) {
      return { label: 'Take Knowledge Check', to: '/training/report-writing/quiz' };
    }
    if (!certificateIssued) {
      return { label: 'Get Your Certificate', to: '/training/report-writing/certificate' };
    }
    return { label: 'View Your Certificate', to: '/training/report-writing/certificate' };
  }

  const nextAction = getNextAction();

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Writing an Expert Witness Testimony Report</h1>
        <p className="portal-page__subtitle">
          Welcome{profile?.first_name ? `, ${profile.first_name}` : ''}. Complete all 8 lessons,
          the branching scenario, and the knowledge check to earn your certificate.
        </p>
      </div>

      {/* Overall progress */}
      <div className="portal-card training-progress-card">
        <div className="training-progress-card__header">
          <span className="training-progress-card__label">Overall Progress</span>
          <span className="training-progress-card__pct">{pct}%</span>
        </div>
        <div className="training-progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Overall progress">
          <div className="training-progress-bar__fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="training-progress-card__meta">
          {completedSteps} of {TOTAL_STEPS} steps complete &middot; ~60 min total
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
                  to={`/training/report-writing/lesson/${lessonId}`}
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
          const accessible = isAdminOrStaff || completedLessons.includes('8');
          return (
            <div
              className={`portal-card training-unit-card${!accessible ? ' training-unit-card--locked' : ''}`}
            >
              <div className="training-unit-card__header">
                <div>
                  <div className="training-unit-card__number">Scenario</div>
                  <h2 className="training-unit-card__title">The Draft Review</h2>
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
                Apply your knowledge to a real-world report review challenge - two decision points,
                immediate feedback, and practical takeaways.
              </p>
              {accessible && (
                <Link
                  to="/training/report-writing/scenario"
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
              <div className="training-unit-card__meta">~5 min &middot; Pass score: 6 out of 8</div>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 14, margin: '8px 0 16px' }}>
                Covers all eight lessons - report structure, opinion writing, materials reviewed,
                methodology, deposition defense, formatting, and common pitfalls. One retry allowed.
              </p>
              {accessible && (
                <Link
                  to="/training/report-writing/quiz"
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
              4 reference guides - quick reference, checklists, preparation guides, and module
              summary
            </p>
          </div>
          <Link to="/training/report-writing/resources" className="btn btn--secondary">
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
