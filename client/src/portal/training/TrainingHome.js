import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { TOTAL_LESSONS } from './courseData';

export default function TrainingHome() {
  const { user, profile } = useAuth();
  const [foundationsPct, setFoundationsPct] = useState(null);
  const [admissibilityPct, setAdmissibilityPct] = useState(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: foundations }, { data: admissibility }] = await Promise.all([
        supabase
          .from('training_progress')
          .select('lesson_id, completed')
          .eq('user_id', user.id),
        supabase
          .from('admissibility_progress')
          .select('lesson_id, completed, quiz_score')
          .eq('user_id', user.id),
      ]);

      if (foundations) {
        const completed = foundations.filter((r) => r.completed && r.lesson_id).length;
        setFoundationsPct(Math.round((completed / TOTAL_LESSONS) * 100));
      }

      if (admissibility) {
        const lessons = admissibility.filter(
          (r) => r.completed && ['1', '2', '3'].includes(r.lesson_id)
        ).length;
        const scenario = admissibility.some((r) => r.lesson_id === 'scenario' && r.completed) ? 1 : 0;
        const quiz = admissibility.some(
          (r) => r.lesson_id === 'quiz' && (r.quiz_score?.score ?? 0) >= 4
        ) ? 1 : 0;
        setAdmissibilityPct(Math.round(((lessons + scenario + quiz) / 5) * 100));
      }
    };
    load();
  }, [user]);

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">
          Training{profile?.first_name ? `, ${profile.first_name}` : ''}
        </h1>
        <p className="portal-page__subtitle">
          Choose a module below to continue your expert witness training.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Expert Witness Foundations */}
        <Link
          to="/training/foundations"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
              Expert Witness Foundations
            </h2>
            {foundationsPct !== null && (
              <span style={{
                background: foundationsPct === 100 ? '#16a34a' : 'var(--color-accent)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                marginLeft: 8,
                flexShrink: 0,
              }}>
                {foundationsPct === 100 ? 'Complete' : `${foundationsPct}%`}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', margin: '0 0 12px' }}>
            ~60 min &middot; 4 units &middot; 10 lessons
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', margin: '0 0 16px', lineHeight: 1.5 }}>
            Core skills for expert witnesses — roles, reports, depositions, and trial testimony.
            Earn your certificate upon completion.
          </p>
          {foundationsPct !== null && foundationsPct > 0 && foundationsPct < 100 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ height: 5, background: 'var(--color-gray-100)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${foundationsPct}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 999 }} />
              </div>
            </div>
          )}
          <span className="btn btn--primary" style={{ display: 'inline-block', pointerEvents: 'none' }}>
            {foundationsPct === 0 || foundationsPct === null ? 'Start Module' : foundationsPct === 100 ? 'Review Module' : 'Continue'}
          </span>
        </Link>

        {/* Standards of Admissibility */}
        <Link
          to="/training/admissibility"
          className="portal-card portal-card--clickable"
          style={{ textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
              Standards of Admissibility
            </h2>
            {admissibilityPct !== null && (
              <span style={{
                background: admissibilityPct === 100 ? '#16a34a' : 'var(--color-accent)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                marginLeft: 8,
                flexShrink: 0,
              }}>
                {admissibilityPct === 100 ? 'Complete' : `${admissibilityPct}%`}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', margin: '0 0 12px' }}>
            ~20 min &middot; 3 lessons &middot; 1 scenario &middot; 1 knowledge check
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', margin: '0 0 16px', lineHeight: 1.5 }}>
            Frye, Kelly, and Daubert — the standards that determine whether your testimony is
            admitted in state and federal court.
          </p>
          {admissibilityPct !== null && admissibilityPct > 0 && admissibilityPct < 100 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ height: 5, background: 'var(--color-gray-100)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${admissibilityPct}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 999 }} />
              </div>
            </div>
          )}
          <span className="btn btn--primary" style={{ display: 'inline-block', pointerEvents: 'none' }}>
            {admissibilityPct === 0 || admissibilityPct === null ? 'Start Module' : admissibilityPct === 100 ? 'Review Module' : 'Continue'}
          </span>
        </Link>
      </div>
    </div>
  );
}
