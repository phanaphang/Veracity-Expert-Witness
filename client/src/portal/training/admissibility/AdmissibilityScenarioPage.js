import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../contexts/ToastContext';
import { SCENARIO_DATA } from './admissibilityData';

export default function AdmissibilityScenarioPage({ onProgressUpdate }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: toastError } = useToast();

  // Which choice is currently displayed (may change during exploration)
  const [viewCP1, setViewCP1] = useState(null);
  const [viewCP2, setViewCP2] = useState(null);

  // Committed choices - these unlock the next section
  const [savedCP1, setSavedCP1] = useState(null);
  const [savedCP2, setSavedCP2] = useState(null);

  const [saving, setSaving] = useState(false);
  const [prevCompleted, setPrevCompleted] = useState(false);

  const cp1Data = SCENARIO_DATA.choicePoints[0];
  const cp2Data = SCENARIO_DATA.choicePoints[1];
  const cp1CorrectId = cp1Data.choices.find((c) => c.correct)?.id;

  // Load prior progress from DB
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('admissibility_progress')
        .select('scenario_choice, completed')
        .eq('user_id', user.id)
        .eq('lesson_id', 'scenario')
        .maybeSingle();

      if (data?.scenario_choice?.cp1) {
        setSavedCP1(data.scenario_choice.cp1);
        setViewCP1(data.scenario_choice.cp1);
      }
      if (data?.scenario_choice?.cp2) {
        setSavedCP2(data.scenario_choice.cp2);
        setViewCP2(data.scenario_choice.cp2);
      }
      if (data?.completed) setPrevCompleted(true);
    };
    load();
  }, [user]);

  const saveToDb = async (cp1Id, cp2Id, isComplete) => {
    const { data: existing } = await supabase
      .from('admissibility_progress')
      .select('id, scenario_choice')
      .eq('user_id', user.id)
      .eq('lesson_id', 'scenario')
      .maybeSingle();

    const scenarioChoice = {
      ...(existing?.scenario_choice || {}),
      ...(cp1Id != null ? { cp1: cp1Id } : {}),
      ...(cp2Id != null ? { cp2: cp2Id } : {}),
    };

    const now = new Date().toISOString();
    const patch = {
      scenario_choice: scenarioChoice,
      ...(isComplete ? { completed: true, completed_at: now } : {}),
    };

    if (existing) {
      await supabase
        .from('admissibility_progress')
        .update(patch)
        .eq('id', existing.id);
    } else {
      await supabase.from('admissibility_progress').insert({
        user_id: user.id,
        lesson_id: 'scenario',
        completed: isComplete,
        ...(isComplete ? { completed_at: now } : {}),
        scenario_choice: scenarioChoice,
      });
    }
  };

  const handlePickCP1 = async (choiceId) => {
    setViewCP1(choiceId);
    if (savedCP1) return; // already committed - exploration only
    setSaving(true);
    try {
      await saveToDb(choiceId, null, false);
      setSavedCP1(choiceId);
    } catch (e) {
      console.error('Scenario CP1 save error', e);
      toastError('Failed to save your choice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePickCP2 = async (choiceId) => {
    setViewCP2(choiceId);
    if (savedCP2) return; // already committed - exploration only
    setSaving(true);
    try {
      await saveToDb(null, choiceId, true);
      setSavedCP2(choiceId);
      if (onProgressUpdate) onProgressUpdate();
    } catch (e) {
      console.error('Scenario CP2 save error', e);
      toastError('Failed to save your choice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const activeCP1 = viewCP1 ? cp1Data.choices.find((c) => c.id === viewCP1) : null;
  const activeCP2 = viewCP2 ? cp2Data.choices.find((c) => c.id === viewCP2) : null;
  const cp1WasWrong = savedCP1 && savedCP1 !== cp1CorrectId;

  return (
    <div className="training-scenario">
      <div className="portal-page__header">
        <div className="training-lesson__unit-badge">Branching Scenario</div>
        <h1 className="portal-page__title">{SCENARIO_DATA.title}</h1>
        <p className="portal-page__subtitle">
          Two decision points &middot; Immediate feedback &middot; Practical takeaways
        </p>
      </div>

      {/* Previously completed notice */}
      {prevCompleted && (
        <div className="portal-alert" style={{ marginBottom: 16 }}>
          You previously completed this scenario. Your choices are shown below - you can explore the
          other options at any time.
        </div>
      )}

      {/* Setup */}
      <div className="portal-card training-scenario__setup">
        <div className="training-scenario__setup-label">The Situation</div>
        <p className="training-scenario__setup-text">{SCENARIO_DATA.setup}</p>
      </div>

      {/* ── Choice Point 1 ── */}
      <div className="portal-card" style={{ marginTop: 24 }}>
        <div
          className="training-lesson__unit-badge"
          style={{ marginBottom: 12, display: 'inline-block' }}
        >
          {cp1Data.title}
        </div>
        <p style={{ color: 'var(--color-gray-700)', marginBottom: 20, lineHeight: 1.6 }}>
          {cp1Data.prompt}
        </p>

        {!activeCP1 ? (
          /* CP1 choices */
          <div className="training-scenario__choices">
            <p className="training-scenario__choose-label">Choose your response:</p>
            {cp1Data.choices.map((choice, i) => (
              <button
                key={choice.id}
                className="training-scenario__choice"
                onClick={() => handlePickCP1(choice.id)}
                disabled={saving}
              >
                <span className="training-scenario__choice-num">{i + 1}</span>
                <span>{choice.text}</span>
              </button>
            ))}
          </div>
        ) : (
          /* CP1 result */
          <div className="training-scenario__result">
            <div
              className={`training-scenario__consequence${
                activeCP1.correct
                  ? ' training-scenario__consequence--correct'
                  : ' training-scenario__consequence--wrong'
              }`}
            >
              <div className="training-scenario__consequence-label">
                {activeCP1.correct ? '✓ Correct' : '✕ Incorrect'}
              </div>
              <p>{activeCP1.consequence}</p>
            </div>

            <div className="training-scenario__takeaway">
              <div className="training-scenario__takeaway-label">What to Remember</div>
              <p>{activeCP1.takeaway}</p>
            </div>

            {/* Explore other CP1 choices */}
            <div className="training-scenario__other-choices">
              <p className="training-scenario__other-label">Explore the other options:</p>
              <div className="training-scenario__choice-grid">
                {cp1Data.choices.map((choice, i) => (
                  <button
                    key={choice.id}
                    className={`training-scenario__choice training-scenario__choice--small${
                      choice.id === viewCP1 ? ' training-scenario__choice--active' : ''
                    }`}
                    onClick={() => setViewCP1(choice.id)}
                  >
                    <span className="training-scenario__choice-num">{i + 1}</span>
                    <span>{choice.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Choice Point 2 - visible after CP1 committed ── */}
      {savedCP1 && (
        <div className="portal-card" style={{ marginTop: 24 }}>
          <div
            className="training-lesson__unit-badge"
            style={{ marginBottom: 12, display: 'inline-block' }}
          >
            {cp2Data.title}
          </div>

          {/* Redirect text when CP1 was answered incorrectly */}
          {cp1WasWrong && (
            <div className="portal-alert" style={{ marginBottom: 16 }}>
              {cp2Data.redirectIfWrongCp1}
            </div>
          )}

          <p style={{ color: 'var(--color-gray-700)', marginBottom: 20, lineHeight: 1.6 }}>
            {cp2Data.prompt}
          </p>

          {!activeCP2 ? (
            /* CP2 choices */
            <div className="training-scenario__choices">
              <p className="training-scenario__choose-label">Choose your response:</p>
              {cp2Data.choices.map((choice, i) => (
                <button
                  key={choice.id}
                  className="training-scenario__choice"
                  onClick={() => handlePickCP2(choice.id)}
                  disabled={saving}
                >
                  <span className="training-scenario__choice-num">{i + 1}</span>
                  <span>{choice.text}</span>
                </button>
              ))}
            </div>
          ) : (
            /* CP2 result */
            <div className="training-scenario__result">
              <div
                className={`training-scenario__consequence${
                  activeCP2.correct
                    ? ' training-scenario__consequence--correct'
                    : ' training-scenario__consequence--wrong'
                }`}
              >
                <div className="training-scenario__consequence-label">
                  {activeCP2.correct ? '✓ Correct' : '✕ Incorrect'}
                </div>
                <p>{activeCP2.consequence}</p>
              </div>

              <div className="training-scenario__takeaway">
                <div className="training-scenario__takeaway-label">What to Remember</div>
                <p>{activeCP2.takeaway}</p>
              </div>

              {/* Explore other CP2 choices */}
              <div className="training-scenario__other-choices">
                <p className="training-scenario__other-label">Explore the other options:</p>
                <div className="training-scenario__choice-grid">
                  {cp2Data.choices.map((choice, i) => (
                    <button
                      key={choice.id}
                      className={`training-scenario__choice training-scenario__choice--small${
                        choice.id === viewCP2 ? ' training-scenario__choice--active' : ''
                      }`}
                      onClick={() => setViewCP2(choice.id)}
                    >
                      <span className="training-scenario__choice-num">{i + 1}</span>
                      <span>{choice.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Scenario Complete Summary - visible after CP2 committed ── */}
      {savedCP2 && (
        <div className="portal-card" style={{ marginTop: 24 }}>
          <div
            style={{
              background: 'var(--color-navy)',
              margin: '-24px -24px 24px',
              padding: '20px 24px',
              borderRadius: '8px 8px 0 0',
            }}
          >
            <div style={{ color: '#d36622', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
              SCENARIO COMPLETE
            </div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: 18 }}>Key Principles to Carry Forward</h2>
          </div>

          <ol style={{ paddingLeft: 20, margin: 0 }}>
            {SCENARIO_DATA.summaryPrinciples.map((principle, i) => (
              <li
                key={i}
                style={{
                  color: 'var(--color-gray-700)',
                  lineHeight: 1.7,
                  marginBottom: i < SCENARIO_DATA.summaryPrinciples.length - 1 ? 16 : 0,
                  fontSize: 15,
                }}
              >
                {principle}
              </li>
            ))}
          </ol>

          <div className="training-scenario__footer" style={{ marginTop: 28 }}>
            <button
              className="btn btn--primary training-scenario__continue"
              onClick={() => navigate('/training/admissibility/quiz')}
            >
              Continue to Knowledge Check →
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <Link to="/training/admissibility" className="training-lesson__back">
          ← Training Home
        </Link>
      </div>
    </div>
  );
}
