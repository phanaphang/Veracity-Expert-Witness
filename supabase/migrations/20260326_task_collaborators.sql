-- ============================================================
-- Task Collaborators
-- ============================================================

CREATE TABLE task_collaborators (
  task_id UUID NOT NULL REFERENCES case_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (task_id, user_id)
);

CREATE INDEX idx_task_collaborators_user ON task_collaborators(user_id);
CREATE INDEX idx_task_collaborators_task ON task_collaborators(task_id);

ALTER TABLE task_collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage task collaborators"
  ON task_collaborators FOR ALL USING (is_admin());
