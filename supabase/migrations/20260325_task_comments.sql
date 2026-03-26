-- =============================================
-- Task Comments Migration
-- Adds: task_comments table for per-task discussion
-- =============================================

CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES case_tasks(id) ON DELETE CASCADE,
  author UUID NOT NULL REFERENCES profiles(id),
  body TEXT NOT NULL CHECK (char_length(body) > 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_comments_author ON task_comments(author);

-- RLS
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage task comments"
  ON task_comments FOR ALL USING (is_admin());

CREATE POLICY "Experts can view comments on their case tasks"
  ON task_comments FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM case_tasks
      JOIN cases ON cases.id = case_tasks.case_id
      WHERE case_tasks.id = task_comments.task_id
      AND (
        cases.assigned_expert = auth.uid()
        OR EXISTS (
          SELECT 1 FROM case_invitations
          WHERE case_invitations.case_id = cases.id
          AND case_invitations.expert_id = auth.uid()
        )
      )
    )
  );
