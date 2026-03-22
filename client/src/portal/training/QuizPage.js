import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { QUIZ_DATA, UNITS } from './courseData';
// navigate imported for future use (e.g., auto-redirect on pass with delay)

const PASS_SCORE = 2;

export default function QuizPage({ onProgressUpdate }) {
  const { unitId } = useParams();
  const _navigate = useNavigate();
  const { user } = useAuth();
  const { error: toastError } = useToast();

  const quiz = QUIZ_DATA[unitId];
  const unit = UNITS.find((u) => u.id === unitId);

  const [answers, setAnswers] = useState({});         // { questionId: optionId }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);        // number of failed attempts
  const [saving, setSaving] = useState(false);
  const [alreadyPassed, setAlreadyPassed] = useState(false);
  const [correctIds, setCorrectIds] = useState(new Set());

  // Check if already passed
  useEffect(() => {
    if (!user || !unitId) return;
    const check = async () => {
      const { data } = await supabase
        .from('training_progress')
        .select('quiz_scores')
        .eq('user_id', user.id)
        .eq('lesson_id', `quiz-${unitId}`)
        .maybeSingle();
      if (data?.quiz_scores?.[unitId] >= PASS_SCORE) setAlreadyPassed(true);
    };
    check();
  }, [user, unitId]);

  if (!quiz || !unit) {
    return (
      <div>
        <div className="portal-alert portal-alert--error">Quiz not found.</div>
        <Link to="/training" className="btn btn--secondary" style={{ marginTop: 16 }}>Back to Training</Link>
      </div>
    );
  }

  const passed = submitted && score >= PASS_SCORE;
  const failed = submitted && score < PASS_SCORE;
  const canRetry = failed && attempts < 2;
  const outOfRetries = failed && attempts >= 2;

  const allAnswered = quiz.questions.every((q) => answers[q.id]);

  const handleSelect = (questionId, optionId) => {
    if (submitted || correctIds.has(questionId)) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    const newCorrectIds = new Set(correctIds);
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.options.find((o) => o.correct)?.id) {
        newCorrectIds.add(q.id);
      }
    });
    setCorrectIds(newCorrectIds);
    const correct = newCorrectIds.size;
    setScore(correct);
    setSubmitted(true);

    const isPassing = correct >= PASS_SCORE;

    // Save score on pass, or on final attempt (regardless of result)
    if (isPassing || attempts >= 2) {
      setSaving(true);
      try {
        const { data: existing } = await supabase
          .from('training_progress')
          .select('id, quiz_scores')
          .eq('user_id', user.id)
          .eq('lesson_id', `quiz-${unitId}`)
          .maybeSingle();

        const quizScores = { ...(existing?.quiz_scores || {}), [unitId]: correct };

        if (existing) {
          await supabase
            .from('training_progress')
            .update({ quiz_scores: quizScores })
            .eq('id', existing.id);
        } else {
          await supabase.from('training_progress').insert({
            user_id: user.id,
            lesson_id: `quiz-${unitId}`,
            completed: isPassing,
            quiz_scores: quizScores,
          });
        }
        if (onProgressUpdate) onProgressUpdate();
      } catch (e) {
        console.error('Quiz save error', e);
        toastError('Failed to save quiz results. Please try again.');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleRetry = () => {
    const kept = {};
    quiz.questions.forEach((q) => {
      if (correctIds.has(q.id)) {
        kept[q.id] = answers[q.id];
      }
    });
    setAnswers(kept);
    setSubmitted(false);
    setScore(0);
    setAttempts((a) => a + 1);
  };

  // Determine next destination after passing
  const unitIndex = UNITS.findIndex((u) => u.id === unitId);
  const nextUnit = UNITS[unitIndex + 1];
  const nextLesson = nextUnit ? nextUnit.lessons[0] : null;

  return (
    <div className="training-quiz">
      <div className="portal-page__header">
        <div className="training-lesson__unit-badge">{unit.title}</div>
        <h1 className="portal-page__title">Knowledge Check</h1>
        <p className="portal-page__subtitle">3 questions · Pass score: 2 out of 3</p>
      </div>

      {/* Already passed banner */}
      {alreadyPassed && !submitted && (
        <div className="portal-alert portal-alert--success" style={{ marginBottom: 24 }}>
          You already passed this knowledge check. You can retake it for review, or{' '}
          {nextLesson ? (
            <Link to={`/training/lesson/${nextLesson}`}>continue to the next unit →</Link>
          ) : (
            <Link to="/training/assessment">take the final assessment →</Link>
          )}
        </div>
      )}

      {/* Passed state */}
      {passed && (
        <div className="training-quiz__result training-quiz__result--pass">
          <div className="training-quiz__result-icon">✓</div>
          <h2>Unit Complete!</h2>
          <p>You scored {score} out of {quiz.questions.length}.</p>
          {saving && <p style={{ color: 'var(--color-gray-400)', fontSize: 14 }}>Saving…</p>}
          <div className="training-quiz__result-actions">
            {nextLesson ? (
              <Link to={`/training/lesson/${nextLesson}`} className="btn btn--primary">
                Continue to Unit {unitIndex + 2} →
              </Link>
            ) : (
              <Link to="/training/assessment" className="btn btn--primary">
                Take Final Assessment →
              </Link>
            )}
            <Link to="/training" className="btn btn--secondary">Back to Dashboard</Link>
          </div>
        </div>
      )}

      {/* Missed questions review (shown after passing with wrong answers) */}
      {passed && score < quiz.questions.length && (
        <div className="training-quiz__review" style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 16, color: 'var(--color-gray-700)' }}>
            Review: Questions You Missed
          </h3>
          {quiz.questions
            .map((q, qi) => ({ q, qi }))
            .filter(({ q }) => answers[q.id] !== q.options.find((o) => o.correct)?.id)
            .map(({ q, qi }) => {
              const correctOption = q.options.find((o) => o.correct);
              return (
                <div key={q.id} className="training-quiz__question portal-card">
                  <div className="training-quiz__q-number">Question {qi + 1}</div>
                  <p className="training-quiz__q-text">{q.text}</p>
                  <div className="training-quiz__options">
                    {q.options.map((opt) => {
                      const isSelected = answers[q.id] === opt.id;
                      let cls = 'training-quiz__option';
                      if (opt.correct) cls += ' training-quiz__option--correct';
                      else if (isSelected) cls += ' training-quiz__option--wrong';
                      return (
                        <button key={opt.id} className={cls} disabled>
                          <span className="training-quiz__option-letter">
                            {opt.id.toUpperCase()}
                          </span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="training-quiz__explanation training-quiz__explanation--wrong">
                    <strong>
                      The correct answer is ({correctOption?.id.toUpperCase()}).
                    </strong>{' '}
                    {q.explanation}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Out of retries */}
      {outOfRetries && (
        <div className="training-quiz__result training-quiz__result--fail">
          <div className="training-quiz__result-icon training-quiz__result-icon--fail">✕</div>
          <h2>Score: {score} / {quiz.questions.length}</h2>
          <p>Review the lessons and try again when you&apos;re ready.</p>
          <div className="training-quiz__result-actions">
            <Link to={`/training/lesson/${unit.lessons[0]}`} className="btn btn--primary">
              Review Unit Lessons
            </Link>
            <Link to="/training" className="btn btn--secondary">Back to Dashboard</Link>
          </div>
        </div>
      )}

      {/* Questions */}
      {!passed && !outOfRetries && (
        <>
          {quiz.questions.map((q, qi) => {
            const selectedId = answers[q.id];
            const correctOption = q.options.find((o) => o.correct);
            const isCorrect = submitted && selectedId === correctOption?.id;
            const lockedCorrect = !submitted && correctIds.has(q.id);

            return (
              <div key={q.id} className={`training-quiz__question portal-card${lockedCorrect ? ' training-quiz__question--locked' : ''}`}>
                <div className="training-quiz__q-number">
                  Question {qi + 1}
                  {lockedCorrect && <span style={{ color: 'var(--color-accent)', marginLeft: 8, fontSize: '0.8em' }}>(Correct)</span>}
                </div>
                <p id={`q-label-${q.id}`} className="training-quiz__q-text">{q.text}</p>

                <div className="training-quiz__options" role="radiogroup" aria-labelledby={`q-label-${q.id}`}>
                  {q.options.map((opt) => {
                    const isSelected = selectedId === opt.id;
                    const isTheCorrect = opt.correct;
                    let cls = 'training-quiz__option';
                    if (lockedCorrect) {
                      if (isSelected) cls += ' training-quiz__option--correct';
                    } else if (submitted) {
                      if (isTheCorrect) cls += ' training-quiz__option--correct';
                      else if (isSelected && !isTheCorrect) cls += ' training-quiz__option--wrong';
                    } else if (isSelected) {
                      cls += ' training-quiz__option--selected';
                    }

                    return (
                      <button
                        key={opt.id}
                        className={cls}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleSelect(q.id, opt.id)}
                        disabled={submitted || lockedCorrect}
                      >
                        <span className="training-quiz__option-letter">
                          {opt.id.toUpperCase()}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submit */}
                {submitted && (
                  <div className={`training-quiz__explanation${isCorrect ? ' training-quiz__explanation--correct' : ' training-quiz__explanation--wrong'}`}>
                    <strong>{isCorrect ? 'Correct.' : `Incorrect. The correct answer is (${correctOption?.id.toUpperCase()}).`}</strong>{' '}
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
              {!allAnswered ? `Answer all ${quiz.questions.length} questions to submit` : 'Submit Answers'}
            </button>
          ) : canRetry ? (
            <div className="training-quiz__retry-bar">
              <div>
                <strong>Score: {score} / {quiz.questions.length}.</strong> You need {PASS_SCORE} to pass. Review the explanations above. {2 - attempts} {2 - attempts === 1 ? 'retry' : 'retries'} remaining.
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
