import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useTrainingProgress() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      if (session?.user) {
        setUser(session.user);
        await loadProgress(session.user.id);
      }
      if (!cancelled) setLoading(false);
    }

    async function loadProgress(userId) {
      const { data, error: fetchError } = await supabase
        .from('sop_training_progress')
        .select('module_id, completed, quiz_score, attempts')
        .eq('user_id', userId);

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      const map = {};
      (data || []).forEach((row) => {
        map[row.module_id] = {
          completed: row.completed,
          quizScore: row.quiz_score,
          attempts: row.attempts,
        };
      });
      setProgress(map);
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (cancelled) return;
        const u = session?.user || null;
        setUser(u);
        if (u) {
          setLoading(true);
          await loadProgress(u.id);
          if (!cancelled) setLoading(false);
        } else {
          setProgress({});
          setLoading(false);
        }
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const saveQuizResult = useCallback(
    async (moduleId, score, answers) => {
      if (!user) return;

      const prev = progress[moduleId];
      const bestScore = prev ? Math.max(prev.quizScore, score) : score;
      const completed = bestScore >= 80;
      const attempts = prev ? prev.attempts + 1 : 1;
      const now = new Date().toISOString();

      const optimistic = {
        completed,
        quizScore: bestScore,
        attempts,
      };

      setProgress((p) => ({ ...p, [moduleId]: optimistic }));

      try {
        const [upsertRes, insertRes] = await Promise.all([
          supabase.from('sop_training_progress').upsert(
            {
              user_id: user.id,
              module_id: moduleId,
              completed,
              quiz_score: bestScore,
              attempts,
              last_attempt_at: now,
              ...(completed && (!prev || !prev.completed)
                ? { completed_at: now }
                : {}),
            },
            { onConflict: 'user_id,module_id' }
          ),
          supabase.from('sop_quiz_attempts').insert({
            user_id: user.id,
            module_id: moduleId,
            score,
            answers,
          }),
        ]);

        if (upsertRes.error) throw upsertRes.error;
        if (insertRes.error) throw insertRes.error;
      } catch (err) {
        setProgress((p) => (prev ? { ...p, [moduleId]: prev } : (() => {
          const next = { ...p };
          delete next[moduleId];
          return next;
        })()));
        setError(err.message);
      }
    },
    [user, progress]
  );

  return { progress, loading, error, user, saveQuizResult };
}
