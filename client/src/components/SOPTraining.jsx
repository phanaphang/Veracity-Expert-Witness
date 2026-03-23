import React, { useState, useMemo, useCallback } from 'react';
import { MODULES, ROLES } from '../data/trainingModules';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import './SOPTraining.css';

const VIEWS = { DASHBOARD: 'dashboard', DETAIL: 'detail', REFERENCE: 'reference' };
const PHASES = { CONTENT: 'content', QUIZ: 'quiz' };
const PASS_THRESHOLD = 80;

export default function SOPTraining() {
  const { progress, loading, saveQuizResult } = useTrainingProgress();

  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [roleFilter, setRoleFilter] = useState('All');
  const [phase, setPhase] = useState(PHASES.CONTENT);

  // Quiz state
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizDone, setQuizDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Reference search
  const [search, setSearch] = useState('');

  const activeModule = useMemo(
    () => MODULES.find((m) => m.id === activeModuleId),
    [activeModuleId]
  );

  const filteredModules = useMemo(
    () =>
      roleFilter === 'All'
        ? MODULES
        : MODULES.filter((m) => m.roles.includes(roleFilter)),
    [roleFilter]
  );

  const completedCount = useMemo(
    () => MODULES.filter((m) => progress[m.id]?.completed).length,
    [progress]
  );

  const avgScore = useMemo(() => {
    const scores = MODULES.map((m) => progress[m.id]?.quizScore).filter(
      (s) => s !== undefined && s > 0
    );
    if (!scores.length) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [progress]);

  const resetQuiz = useCallback(() => {
    setQIndex(0);
    setSelected(null);
    setChecked(false);
    setQuizAnswers([]);
    setQuizDone(false);
    setQuizScore(0);
  }, []);

  const openModule = useCallback((id) => {
    setActiveModuleId(id);
    setView(VIEWS.DETAIL);
    setPhase(PHASES.CONTENT);
    resetQuiz();
  }, [resetQuiz]);

  const goBack = useCallback(() => {
    setView(VIEWS.DASHBOARD);
    setActiveModuleId(null);
    resetQuiz();
  }, [resetQuiz]);

  function startQuiz() {
    resetQuiz();
    setPhase(PHASES.QUIZ);
  }

  function checkAnswer() {
    if (selected === null || !activeModule) return;
    setChecked(true);
    const q = activeModule.quiz[qIndex];
    const isCorrect = selected === q.correct;
    setQuizAnswers((prev) => [
      ...prev,
      { questionIndex: qIndex, selected, correct: q.correct, isCorrect },
    ]);
  }

  function nextQuestion() {
    if (!activeModule) return;
    if (qIndex + 1 < activeModule.quiz.length) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    const answers = [
      ...quizAnswers,
    ];
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const total = activeModule.quiz.length;
    const pct = Math.round((correctCount / total) * 100);
    setQuizScore(pct);
    setQuizDone(true);
    saveQuizResult(activeModule.id, pct, answers);
  }

  // Reference data
  const refSections = useMemo(() => {
    const all = [];
    MODULES.forEach((m) => {
      m.sections.forEach((s) => {
        all.push({ moduleTitle: m.title, moduleIcon: m.icon, ...s });
      });
    });
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
    );
  }, [search]);

  if (loading) {
    return (
      <div className="sop-training">
        <div className="sop-loading">
          <div className="sop-spinner" />
          <span>Loading training data…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sop-training">
      {/* Top nav */}
      <nav className="sop-nav">
        <button
          className={`sop-nav__btn ${view === VIEWS.DASHBOARD ? 'sop-nav__btn--active' : ''}`}
          onClick={() => { setView(VIEWS.DASHBOARD); setActiveModuleId(null); resetQuiz(); }}
        >
          Dashboard
        </button>
        <button
          className={`sop-nav__btn ${view === VIEWS.REFERENCE ? 'sop-nav__btn--active' : ''}`}
          onClick={() => { setView(VIEWS.REFERENCE); setActiveModuleId(null); resetQuiz(); }}
        >
          SOP Reference
        </button>
      </nav>

      {/* ========== Dashboard ========== */}
      {view === VIEWS.DASHBOARD && (
        <>
          <div className="sop-header">
            <h1 className="sop-header__title">SOP Training Hub</h1>
            <p className="sop-header__subtitle">
              Complete all modules to master our standard operating procedures.
            </p>
          </div>

          <div className="sop-stats">
            <div className="sop-stat">
              <div className="sop-stat__value">
                {completedCount}/{MODULES.length}
              </div>
              <div className="sop-stat__label">Modules Completed</div>
              <div className="sop-stat__bar">
                <div
                  className="sop-stat__bar-fill"
                  style={{ width: `${(completedCount / MODULES.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="sop-stat">
              <div className="sop-stat__value">{avgScore}%</div>
              <div className="sop-stat__label">Average Quiz Score</div>
            </div>
            <div
              className={`sop-stat ${
                completedCount === MODULES.length ? 'sop-stat--success' : 'sop-stat--progress'
              }`}
            >
              <div className="sop-stat__value">
                {completedCount === MODULES.length ? 'Complete' : 'In Progress'}
              </div>
              <div className="sop-stat__label">
                {completedCount === MODULES.length
                  ? 'All modules finished'
                  : `${MODULES.length - completedCount} remaining`}
              </div>
            </div>
          </div>

          <div className="sop-filters">
            <button
              className={`sop-filters__btn ${roleFilter === 'All' ? 'sop-filters__btn--active' : ''}`}
              onClick={() => setRoleFilter('All')}
            >
              All
            </button>
            {ROLES.map((r) => (
              <button
                key={r}
                className={`sop-filters__btn ${roleFilter === r ? 'sop-filters__btn--active' : ''}`}
                onClick={() => setRoleFilter(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="sop-grid">
            {filteredModules.map((m) => {
              const p = progress[m.id];
              return (
                <div
                  key={m.id}
                  className="sop-card"
                  onClick={() => openModule(m.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModule(m.id); } }}
                >
                  <div className="sop-card__icon">{m.icon}</div>
                  <h3 className="sop-card__title">{m.title}</h3>
                  <p className="sop-card__desc">{m.description}</p>
                  <div className="sop-card__roles">
                    {m.roles.map((r) => (
                      <span key={r} className="sop-card__pill">{r}</span>
                    ))}
                  </div>
                  <div className="sop-card__footer">
                    {p?.completed ? (
                      <span className="sop-card__badge sop-card__badge--done">
                        &#10003; Complete
                      </span>
                    ) : (
                      <span className="sop-card__badge sop-card__badge--pending">
                        Not started
                      </span>
                    )}
                    {p?.attempts > 0 && (
                      <span className="sop-card__score">
                        Quiz: {p.quizScore}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ========== Module Detail ========== */}
      {view === VIEWS.DETAIL && activeModule && (
        <div className="sop-detail">
          <button className="sop-back" onClick={goBack}>
            &larr; Back to Dashboard
          </button>

          <div className="sop-detail__header">
            <span className="sop-detail__icon">{activeModule.icon}</span>
            <div className="sop-detail__info">
              <h2 className="sop-detail__title">{activeModule.title}</h2>
              <p className="sop-detail__desc">{activeModule.description}</p>
              <div className="sop-detail__roles">
                {activeModule.roles.map((r) => (
                  <span key={r} className="sop-card__pill">{r}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="sop-toggle">
            <button
              className={`sop-toggle__btn ${phase === PHASES.CONTENT ? 'sop-toggle__btn--active' : ''}`}
              onClick={() => { setPhase(PHASES.CONTENT); resetQuiz(); }}
            >
              Training Content
            </button>
            <button
              className={`sop-toggle__btn ${phase === PHASES.QUIZ ? 'sop-toggle__btn--active' : ''}`}
              onClick={startQuiz}
            >
              Knowledge Check
            </button>
          </div>

          {/* Content phase */}
          {phase === PHASES.CONTENT && (
            <>
              <div className="sop-sections">
                {activeModule.sections.map((s, i) => (
                  <div key={i} className="sop-section">
                    <h3 className="sop-section__title">{s.title}</h3>
                    <p className="sop-section__content">{s.content}</p>
                  </div>
                ))}
              </div>
              <div className="sop-cta">
                <button className="sop-cta__btn" onClick={startQuiz}>
                  Take the Knowledge Check &rarr;
                </button>
              </div>
            </>
          )}

          {/* Quiz phase */}
          {phase === PHASES.QUIZ && !quizDone && (
            <div className="sop-quiz">
              <div className="sop-quiz__counter">
                Question {qIndex + 1} of {activeModule.quiz.length}
              </div>
              <h3 className="sop-quiz__question">
                {activeModule.quiz[qIndex].question}
              </h3>
              <div className="sop-quiz__options">
                {activeModule.quiz[qIndex].options.map((opt, i) => {
                  let cls = 'sop-quiz__option';
                  if (checked) {
                    if (i === activeModule.quiz[qIndex].correct) cls += ' sop-quiz__option--correct';
                    else if (i === selected) cls += ' sop-quiz__option--wrong';
                  } else if (i === selected) {
                    cls += ' sop-quiz__option--selected';
                  }
                  return (
                    <button
                      key={i}
                      className={cls}
                      onClick={() => !checked && setSelected(i)}
                      disabled={checked}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {checked && (
                <div className="sop-quiz__explanation">
                  {activeModule.quiz[qIndex].explanation}
                </div>
              )}
              <div className="sop-quiz__actions">
                {!checked ? (
                  <button
                    className="sop-quiz__btn sop-quiz__btn--primary"
                    disabled={selected === null}
                    onClick={checkAnswer}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    className="sop-quiz__btn sop-quiz__btn--primary"
                    onClick={nextQuestion}
                  >
                    {qIndex + 1 < activeModule.quiz.length
                      ? 'Next Question \u2192'
                      : 'See Results'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {phase === PHASES.QUIZ && quizDone && (
            <div className="sop-results">
              <div className="sop-results__emoji">
                {quizScore >= PASS_THRESHOLD ? '\u{1F389}' : '\u{1F4DA}'}
              </div>
              <div
                className={`sop-results__score ${
                  quizScore >= PASS_THRESHOLD ? 'sop-results__score--pass' : ''
                }`}
              >
                {quizScore}%
              </div>
              <p className="sop-results__msg">
                {quizScore >= PASS_THRESHOLD
                  ? 'Great work! You passed this module.'
                  : `You need ${PASS_THRESHOLD}% to pass. Review the content and try again.`}
              </p>
              <div className="sop-results__actions">
                <button
                  className="sop-quiz__btn sop-quiz__btn--secondary"
                  onClick={() => { setPhase(PHASES.CONTENT); resetQuiz(); }}
                >
                  Review Content
                </button>
                <button
                  className="sop-quiz__btn sop-quiz__btn--secondary"
                  onClick={startQuiz}
                >
                  Retake Quiz
                </button>
                <button
                  className="sop-quiz__btn sop-quiz__btn--primary"
                  onClick={goBack}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========== SOP Reference ========== */}
      {view === VIEWS.REFERENCE && (
        <div className="sop-ref">
          <div className="sop-header">
            <h1 className="sop-header__title">SOP Reference</h1>
            <p className="sop-header__subtitle">
              Search across all standard operating procedures.
            </p>
          </div>

          <div className="sop-ref__search">
            <span className="sop-ref__icon">&#128269;</span>
            <input
              className="sop-ref__input"
              type="text"
              placeholder="Search SOPs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="sop-ref__count">
            {refSections.length} section{refSections.length !== 1 ? 's' : ''} found
          </div>

          <div className="sop-ref__list">
            {refSections.map((s, i) => (
              <div key={i} className="sop-ref__card">
                <span className="sop-ref__tag">
                  {s.moduleIcon} {s.moduleTitle}
                </span>
                <h3 className="sop-ref__title">{s.title}</h3>
                <p className="sop-ref__content">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
