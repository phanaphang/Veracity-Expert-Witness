-- =============================================
-- Task Comment Reads Migration
-- Tracks when a user last read comments on a task
-- =============================================

CREATE TABLE task_comment_reads (
  user_id UUID NOT NULL REFERENCES profiles(id),
  task_id UUID NOT NULL REFERENCES case_tasks(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, task_id)
);

CREATE INDEX idx_task_comment_reads_user ON task_comment_reads(user_id);

-- RLS
ALTER TABLE task_comment_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own read timestamps"
  ON task_comment_reads FOR ALL USING (auth.uid() = user_id);
