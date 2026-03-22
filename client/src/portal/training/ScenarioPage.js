import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { SCENARIO_DATA, UNITS } from './courseData';

export default function ScenarioPage({ onProgressUpdate }) {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: toastError } = useToast();

  const scenario = SCENARIO_DATA[scenarioId];
  const unit = scenario ? UNITS.find((u) => u.scenarioId === scenarioId) : null;

  const [selected, setSelected] = useState(null);   // choice id
  const [saving, setSaving] = useState(false);
  const [previousChoice, setPreviousChoice] = useState(null);

  // Load any prior choice
  useEffect(() => {
    if (!user || !scenarioId) return;
    const load = async () => {
      const { data } = await supabase
        .from('training_progress')
        .select('scenario_choices')
        .eq('user_id', user.id)
        .eq('lesson_id', `scenario-${scenarioId}`)
        .maybeSingle();
      if (data?.scenario_choices?.[scenarioId]) {
        setPreviousChoice(data.scenario_choices[scenarioId]);
      }
    };
    load();
  }, [user, scenarioId]);

  if (!scenario || !unit) {
    return (
      <div>
        <div className="portal-alert portal-alert--error">Scenario not found.</div>
        <Link to="/training" className="btn btn--secondary" style={{ marginTop: 16 }}>Back to Training</Link>
      </div>
    );
  }

  const activeChoice = selected
    ? scenario.choices.find((c) => c.id === selected)
    : previousChoice
    ? scenario.choices.find((c) => c.id === previousChoice)
    : null;

  const handleChoose = async (choiceId) => {
    setSelected(choiceId);
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('training_progress')
        .select('id, scenario_choices')
        .eq('user_id', user.id)
        .eq('lesson_id', `scenario-${scenarioId}`)
        .maybeSingle();

      const scenarioChoices = {
        ...(existing?.scenario_choices || {}),
        [scenarioId]: choiceId,
      };

      if (existing) {
        await supabase
          .from('training_progress')
          .update({ scenario_choices: scenarioChoices, completed: true })
          .eq('id', existing.id);
      } else {
        await supabase.from('training_progress').insert({
          user_id: user.id,
          lesson_id: `scenario-${scenarioId}`,
          completed: true,
          scenario_choices: scenarioChoices,
        });
      }
      if (onProgressUpdate) onProgressUpdate();
    } catch (e) {
      console.error('Scenario save error', e);
      toastError('Failed to save your choice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = () => {
    navigate(`/training/quiz/${unit.quizId}`);
  };

  return (
    <div className="training-scenario">
      <div className="portal-page__header">
        <div className="training-lesson__unit-badge">{unit.title} · Branching Scenario</div>
        <h1 className="portal-page__title">{scenario.title}</h1>
      </div>

      {/* Setup */}
      <div className="portal-card training-scenario__setup">
        <div className="training-scenario__setup-label">The Situation</div>
        <p className="training-scenario__setup-text">{scenario.setup}</p>
      </div>

      {/* Previously completed notice */}
      {previousChoice && !selected && (
        <div className="portal-alert" style={{ marginBottom: 16 }}>
          You previously chose option {scenario.choices.findIndex(c => c.id === previousChoice) + 1}. You can review your choice below or try a different option.
        </div>
      )}

      {/* Choices */}
      {!activeChoice && (
        <div className="training-scenario__choices">
          <p className="training-scenario__choose-label">Choose your response:</p>
          {scenario.choices.map((choice, i) => (
            <button
              key={choice.id}
              className="training-scenario__choice"
              onClick={() => handleChoose(choice.id)}
              disabled={saving}
            >
              <span className="training-scenario__choice-num">{i + 1}</span>
              <span>{choice.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Consequence + takeaway */}
      {activeChoice && (
        <div className="training-scenario__result">
          <div className={`training-scenario__consequence${activeChoice.correct ? ' training-scenario__consequence--correct' : ' training-scenario__consequence--wrong'}`}>
            <div className="training-scenario__consequence-label">
              {activeChoice.correct ? '✓ Best Approach' : '✕ What Happened'}
            </div>
            <p>{activeChoice.consequence}</p>
          </div>

          <div className="training-scenario__takeaway">
            <div className="training-scenario__takeaway-label">What to Remember</div>
            <p>{activeChoice.takeaway}</p>
          </div>

          {/* Let user explore other branches */}
          <div className="training-scenario__other-choices">
            <p className="training-scenario__other-label">Explore the other options:</p>
            <div className="training-scenario__choice-grid">
              {scenario.choices.map((choice, i) => {
                const isActive = choice.id === (selected || previousChoice);
                return (
                  <button
                    key={choice.id}
                    className={`training-scenario__choice training-scenario__choice--small${isActive ? ' training-scenario__choice--active' : ''}`}
                    onClick={() => setSelected(choice.id)}
                  >
                    <span className="training-scenario__choice-num">{i + 1}</span>
                    <span>{choice.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="training-scenario__footer">
            <button
              className="btn btn--primary training-scenario__continue"
              onClick={handleContinue}
            >
              Continue to Knowledge Check →
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <Link to="/training" className="training-lesson__back">← Training Home</Link>
      </div>
    </div>
  );
}
