import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { ASSESSMENT_DATA, UNITS } from './courseData';

const PASS_SCORE = 8;
const TOTAL = ASSESSMENT_DATA.length;

export default function AssessmentPage({ onProgressUpdate }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [saving, setSaving] = useState(false);
  const [alreadyPassed, setAlreadyPassed] = useState(false);

  useEffect(() => {
    if (!user) return;
    const check = async () => {
      const { data } = await supabase
        .from('training_progress')
        .select('quiz_scores, completed')
        .eq('user_id', user.id)
        .eq('lesson_id', 'assessment')
        .maybeSingle();
      if (data?.completed) setAlreadyPassed(true);
    };
    check();
  }, [user]);

  const allAnswered = ASSESSMENT_DATA.every((q) => answers[q.id]);
  const passed = submitted && score >= PASS_SCORE;
  const failed = submitted && score < PASS_SCORE;
  const canRetry = failed && attempts === 0;
  const outOfRetries = failed && attempts >= 1;

  // Score breakdown by unit
  const unitBreakdown = UNITS.map((unit) => {
    const unitQs = ASSESSMENT_DATA.filter((q) => q.unitId === unit.id);
    const correct = submitted
      ? unitQs.filter((q) => answers[q.id] === q.options.find((o) => o.correct)?.id).length
      : 0;
    return { unit, total: unitQs.length, correct };
  });

  const handleSelect = (questionId, optionId) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    const correct = ASSESSMENT_DATA.filter(
      (q) => answers[q.id] === q.options.find((o) => o.correct)?.id
    ).length;
    setScore(correct);
    setSubmitted(true);

    const isPassing = correct >= PASS_SCORE;

    if (isPassing || attempts >= 1) {
      setSaving(true);
      try {
        const { data: existing } = await supabase
          .from('training_progress')
          .select('id')
          .eq('user_id', user.id)
          .eq('lesson_id', 'assessment')
          .maybeSingle();

        const row = {
          user_id: user.id,
          lesson_id: 'assessment',
          completed: isPassing,
          quiz_scores: { assessment: correct },
          completed_at: isPassing ? new Date().toISOString() : null,
        };

        if (existing) {
          await supabase.from('training_progress').update(row).eq('id', existing.id);
        } else {
          await supabase.from('training_progress').insert(row);
        }

        if (onProgressUpdate) onProgressUpdate();
        if (isPassing) navigate('/training/certificate');
      } catch (e) {
        console.error('Assessment save error', e);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setAttempts(1);
  };

  return (
    <div className="training-quiz">
      <div className="portal-page__header">
        <h1 className="portal-page__title">Final Assessment</h1>
        <p className="portal-page__subtitle">
          {TOTAL} questions · Pass score: {PASS_SCORE}/{TOTAL} (80%) · Covers all 4 units
        </p>
      </div>

      {alreadyPassed && !submitted && (
        <div className="portal-alert portal-alert--success" style={{ marginBottom: 24 }}>
          You have already passed this assessment.{' '}
          <Link to="/training/certificate">View your certificate →</Link>
        </div>
      )}

      {/* Passed — navigate handled by useEffect, but show fallback */}
      {passed && (
        <div className="training-quiz__result training-quiz__result--pass">
          <div className="training-quiz__result-icon">✓</div>
          <h2>Assessment Passed!</h2>
          <p>You scored {score} out of {TOTAL}. {saving ? 'Saving your results…' : 'Redirecting to your certificate…'}</p>
          <Link to="/training/certificate" className="btn btn--primary" style={{ marginTop: 16 }}>
            Get Your Certificate →
          </Link>
        </div>
      )}

      {/* Out of retries */}
      {outOfRetries && (
        <div className="training-quiz__result training-quiz__result--fail">
          <div className="training-quiz__result-icon training-quiz__result-icon--fail">✕</div>
          <h2>Score: {score} / {TOTAL}</h2>
          <p>Review the lessons below and try again when you&apos;re ready.</p>

          <div className="training-assessment__breakdown">
            {unitBreakdown.map(({ unit, total, correct }) => (
              <div key={unit.id} className="training-assessment__unit-row">
                <div className="training-assessment__unit-name">{unit.title}</div>
                <div className={`training-assessment__unit-score${correct === total ? ' training-assessment__unit-score--full' : ''}`}>
                  {correct}/{total}
                </div>
                <Link to={`/training/lesson/${unit.lessons[0]}`} className="training-assessment__review-link">
                  Review →
                </Link>
              </div>
            ))}
          </div>

          <div className="training-quiz__result-actions">
            <Link to="/training" className="btn btn--secondary">Back to Dashboard</Link>
          </div>
        </div>
      )}

      {/* Questions */}
      {!passed && !outOfRetries && (
        <>
          {ASSESSMENT_DATA.map((q, qi) => {
            const selectedId = answers[q.id];
            const correctOption = q.options.find((o) => o.correct);
            const isCorrect = submitted && selectedId === correctOption?.id;
            const unitLabel = UNITS.find((u) => u.id === q.unitId)?.title;

            return (
              <div key={q.id} className="training-quiz__question portal-card">
                <div className="training-quiz__q-meta">
                  <span className="training-quiz__q-number">Question {qi + 1}</span>
                  <span className="training-quiz__q-unit">{unitLabel}</span>
                </div>
                <p className="training-quiz__q-text">{q.text}</p>

                <div className="training-quiz__options">
                  {q.options.map((opt) => {
                    const isSelected = selectedId === opt.id;
                    const isTheCorrect = opt.correct;
                    let cls = 'training-quiz__option';
                    if (submitted) {
                      if (isTheCorrect) cls += ' training-quiz__option--correct';
                      else if (isSelected && !isTheCorrect) cls += ' training-quiz__option--wrong';
                    } else if (isSelected) {
                      cls += ' training-quiz__option--selected';
                    }

                    return (
                      <button
                        key={opt.id}
                        className={cls}
                        onClick={() => handleSelect(q.id, opt.id)}
                        disabled={submitted}
                      >
                        <span className="training-quiz__option-letter">{opt.id.toUpperCase()}</span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className={`training-quiz__explanation${isCorrect ? ' training-quiz__explanation--correct' : ' training-quiz__explanation--wrong'}`}>
                    <strong>{isCorrect ? 'Correct.' : `Incorrect. The correct answer is (${correctOption?.id.toUpperCase()}).`}</strong>{' '}
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {/* Score breakdown if failed first try */}
          {failed && canRetry && (
            <div className="training-assessment__breakdown portal-card">
              <h3 style={{ margin: '0 0 16px', color: 'var(--color-navy)' }}>Score by Unit</h3>
              {unitBreakdown.map(({ unit, total, correct }) => (
                <div key={unit.id} className="training-assessment__unit-row">
                  <div className="training-assessment__unit-name">{unit.title}</div>
                  <div className={`training-assessment__unit-score${correct === total ? ' training-assessment__unit-score--full' : ''}`}>
                    {correct}/{total}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!submitted ? (
            <button
              className="btn btn--primary training-quiz__submit"
              onClick={handleSubmit}
              disabled={!allAnswered || saving}
            >
              {!allAnswered
                ? `Answer all ${TOTAL} questions to submit`
                : saving
                ? 'Saving…'
                : 'Submit Assessment'}
            </button>
          ) : canRetry ? (
            <div className="training-quiz__retry-bar">
              <div>
                <strong>Score: {score} / {TOTAL}.</strong> You need {PASS_SCORE} to pass. Review the explanations and unit scores above, then try once more.
              </div>
              <button className="btn btn--primary" onClick={handleRetry}>Try Again</button>
            </div>
          ) : null}
        </>
      )}

      <div style={{ marginTop: 24 }}>
        <Link to="/training" className="training-lesson__back">← Training Home</Link>
      </div>
    </div>
  );
}
