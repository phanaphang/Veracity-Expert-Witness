import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { QUIZ_DATA, PASS_SCORE, TOTAL_QUESTIONS } from './depositionData';

export default function DepositionQuizPage({ onProgressUpdate }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [answers, setAnswers] = useState({});       // { questionId: optionId }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);      // 0 = first try, 1 = one retry used
  const [saving, setSaving] = useState(false);
  const [alreadyPassed, setAlreadyPassed] = useState(false);

  // Check if already passed
  useEffect(() => {
    if (!user) return;
    const check = async () => {
      const { data } = await supabase
        .from('deposition_progress')
        .select('quiz_score')
        .eq('user_id', user.id)
        .eq('lesson_id', 'quiz')
        .maybeSingle();
      if ((data?.quiz_score?.score ?? 0) >= 6) setAlreadyPassed(true);
    };
    check();
  }, [user]);

  const passed = submitted && score >= PASS_SCORE;
  const failed = submitted && score < PASS_SCORE;
  const canRetry = failed && attempts === 0;
  const outOfRetries = failed && attempts >= 1;

  const allAnswered = QUIZ_DATA.questions.every((q) => answers[q.id]);

  const handleSelect = (questionId, optionId) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    const correct = QUIZ_DATA.questions.filter(
      (q) => answers[q.id] === q.options.find((o) => o.correct)?.id
    ).length;
    setScore(correct);
    setSubmitted(true);

    const isPassing = correct >= PASS_SCORE;

    // Save on pass or on final attempt
    if (isPassing || attempts >= 1) {
      setSaving(true);
      try {
        const now = new Date().toISOString();
        const { data: existing } = await supabase
          .from('deposition_progress')
          .select('id')
          .eq('user_id', user.id)
          .eq('lesson_id', 'quiz')
          .maybeSingle();

        const quizScore = { score: correct };
        const patch = {
          quiz_score: quizScore,
          completed: isPassing,
          ...(isPassing ? { completed_at: now } : {}),
        };

        if (existing) {
          await supabase
            .from('deposition_progress')
            .update(patch)
            .eq('id', existing.id);
        } else {
          await supabase.from('deposition_progress').insert({
            user_id: user.id,
            lesson_id: 'quiz',
            ...patch,
          });
        }

        if (onProgressUpdate) onProgressUpdate();

        if (isPassing) {
          // Brief delay so user can read the pass banner before redirect
          setTimeout(() => navigate('/training/deposition/certificate'), 1800);
        }
      } catch (e) {
        console.error('Quiz save error', e);
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
        <div className="training-lesson__unit-badge">Knowledge Check</div>
        <h1 className="portal-page__title">Deposition Quiz</h1>
        <p className="portal-page__subtitle">
          {TOTAL_QUESTIONS} questions &middot; Pass score: {PASS_SCORE} out of {TOTAL_QUESTIONS} &middot; One retry allowed
        </p>
      </div>

      {/* Already passed banner */}
      {alreadyPassed && !submitted && (
        <div className="portal-alert portal-alert--success" style={{ marginBottom: 24 }}>
          You already passed this knowledge check. You can retake it for review, or{' '}
          <Link to="/training/deposition/certificate">go to your certificate &rarr;</Link>
        </div>
      )}

      {/* Passed state */}
      {passed && (
        <div className="training-quiz__result training-quiz__result--pass">
          <div className="training-quiz__result-icon">{'\u2713'}</div>
          <h2>Knowledge Check Complete!</h2>
          <p>
            You scored {score} out of {TOTAL_QUESTIONS}.
          </p>
          {saving && (
            <p style={{ color: 'var(--color-gray-400)', fontSize: 14 }}>Saving...</p>
          )}
          <p style={{ color: 'var(--color-gray-500)', fontSize: 14 }}>
            Redirecting to your certificate...
          </p>
          <div className="training-quiz__result-actions">
            <Link to="/training/deposition/certificate" className="btn btn--primary">
              Get Your Certificate &rarr;
            </Link>
            <Link to="/training/deposition" className="btn btn--secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Out of retries */}
      {outOfRetries && (
        <div className="training-quiz__result training-quiz__result--fail">
          <div className="training-quiz__result-icon training-quiz__result-icon--fail">{'\u2715'}</div>
          <h2>
            Score: {score} / {TOTAL_QUESTIONS}
          </h2>
          <p>Review the lessons and try again when you&apos;re ready.</p>
          <div className="training-quiz__result-actions">
            <Link to="/training/deposition/lesson/1" className="btn btn--primary">
              Review Lessons
            </Link>
            <Link to="/training/deposition" className="btn btn--secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Questions - hidden after pass or out of retries */}
      {!passed && !outOfRetries && (
        <>
          {QUIZ_DATA.questions.map((q, qi) => {
            const selectedId = answers[q.id];
            const correctOption = q.options.find((o) => o.correct);
            const isCorrect = submitted && selectedId === correctOption?.id;

            return (
              <div key={q.id} className="training-quiz__question portal-card">
                <div className="training-quiz__q-number">Question {qi + 1}</div>
                <p className="training-quiz__q-text">{q.text}</p>

                <div className="training-quiz__options">
                  {q.options.map((opt) => {
                    const isSelected = selectedId === opt.id;
                    let cls = 'training-quiz__option';
                    if (submitted) {
                      if (opt.correct) cls += ' training-quiz__option--correct';
                      else if (isSelected && !opt.correct) cls += ' training-quiz__option--wrong';
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
                        <span className="training-quiz__option-letter">
                          {opt.id.toUpperCase()}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div
                    className={`training-quiz__explanation${
                      isCorrect
                        ? ' training-quiz__explanation--correct'
                        : ' training-quiz__explanation--wrong'
                    }`}
                  >
                    <strong>
                      {isCorrect
                        ? 'Correct.'
                        : `Incorrect. The correct answer is (${correctOption?.id.toUpperCase()}).`}
                    </strong>{' '}
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit / Retry */}
          {!submitted ? (
            <button
              className="btn btn--primary training-quiz__submit"
              onClick={handleSubmit}
              disabled={!allAnswered || saving}
            >
              {!allAnswered
                ? `Answer all ${TOTAL_QUESTIONS} questions to submit`
                : 'Submit Answers'}
            </button>
          ) : canRetry ? (
            <div className="training-quiz__retry-bar">
              <div>
                <strong>
                  Score: {score} / {TOTAL_QUESTIONS}.
                </strong>{' '}
                You need {PASS_SCORE} to pass. Review the explanations above and try once more.
              </div>
              <button className="btn btn--primary" onClick={handleRetry}>
                Try Again
              </button>
            </div>
          ) : null}
        </>
      )}

      <div style={{ marginTop: 24 }}>
        <Link to="/training/deposition" className="training-lesson__back">
          &larr; Training Home
        </Link>
      </div>
    </div>
  );
}
