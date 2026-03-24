import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useTrainingProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setProgress({});
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function loadProgress() {
      const { data, error: fetchError } = await supabase
        .from('sop_training_progress')
        .select('module_id, completed, quiz_score, attempts')
        .eq('user_id', user.id);

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
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
      setLoading(false);
    }

    loadProgress();

    return () => { cancelled = true; };
  }, [user]);

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
