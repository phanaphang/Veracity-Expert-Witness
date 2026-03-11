import React, { useState, useEffect, useCallback } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import TrainingSidebar from './TrainingSidebar';

export default function TrainingLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, idleWarning, resetIdleTimer } = useContext(AuthContext);

  const [completedLessons, setCompletedLessons] = useState([]);
  const [passedQuizzes, setPassedQuizzes] = useState([]);

  const loadProgress = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('training_progress')
        .select('lesson_id, completed, quiz_scores')
        .eq('user_id', user.id);

      if (!data) return;

      const done = data
        .filter((r) => r.completed && r.lesson_id)
        .map((r) => r.lesson_id);
      setCompletedLessons(done);

      // Derive passed quizzes from quiz_scores — each row may have quiz scores
      // for multiple units. Collect all unit keys where score >= 2/3.
      const passed = new Set();
      data.forEach((row) => {
        if (row.quiz_scores && typeof row.quiz_scores === 'object') {
          Object.entries(row.quiz_scores).forEach(([unitId, score]) => {
            if (score >= 2) passed.add(unitId);
          });
        }
      });
      setPassedQuizzes(Array.from(passed));
    } catch (e) {
      console.error('TrainingLayout: failed to load progress', e);
    }
  }, [user]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return (
    <div className="training-layout">
      {/* Mobile overlay */}
      <div
        className={`portal-overlay${sidebarOpen ? ' portal-overlay--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={`training-sidebar-wrapper${sidebarOpen ? ' training-sidebar-wrapper--open' : ''}`}>
        <TrainingSidebar
          completedLessons={completedLessons}
          passedQuizzes={passedQuizzes}
          onNavigate={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content area */}
      <main className="training-main">
        {idleWarning && (
          <div className="portal-idle-warning" role="alert">
            <span>Your session will expire in 2 minutes due to inactivity.</span>
            <button className="portal-idle-warning__btn" onClick={resetIdleTimer}>
              Stay signed in
            </button>
          </div>
        )}

        <header className="portal-topbar">
          <button
            className="portal-topbar__menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
          >
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <span className="portal-topbar__title">Expert Witness Foundations</span>
        </header>

        <div className="portal-content">
          {/* Pass loadProgress down so lesson/quiz pages can refresh sidebar */}
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child, { onProgressUpdate: loadProgress })
              : child
          )}
        </div>
      </main>
    </div>
  );
}
