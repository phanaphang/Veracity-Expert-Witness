-- =============================================
-- Project Management Migration
-- Adds: case_phase, case_tasks, case_time_entries, case_activity_log
-- =============================================

-- 1A. Add case_phase column to cases table
ALTER TABLE cases
  ADD COLUMN case_phase TEXT NOT NULL DEFAULT 'intake'
  CHECK (case_phase IN (
    'intake',
    'records_review',
    'report_drafting',
    'report_review',
    'deposition_prep',
    'trial_prep',
    'closed'
  ));

-- Backfill existing closed cases
UPDATE cases SET case_phase = 'closed' WHERE status = 'closed';

-- Index for phase filtering
CREATE INDEX idx_cases_phase ON cases(case_phase);

-- =============================================
-- 1B. case_tasks table
-- =============================================
CREATE TABLE case_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  assignee UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'to_do'
    CHECK (status IN ('to_do', 'in_progress', 'done')),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER case_tasks_updated_at
  BEFORE UPDATE ON case_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_case_tasks_case_id ON case_tasks(case_id);
CREATE INDEX idx_case_tasks_assignee ON case_tasks(assignee);

-- RLS
ALTER TABLE case_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage case tasks"
  ON case_tasks FOR ALL USING (is_admin());

CREATE POLICY "Experts can view tasks on their cases"
  ON case_tasks FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_tasks.case_id
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

-- =============================================
-- 1C. case_time_entries table
-- =============================================
CREATE TABLE case_time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  task_id UUID REFERENCES case_tasks(id) ON DELETE SET NULL,
  hours NUMERIC NOT NULL CHECK (hours >= 0),
  minutes INTEGER NOT NULL DEFAULT 0 CHECK (minutes >= 0 AND minutes < 60),
  description TEXT DEFAULT '',
  work_type TEXT NOT NULL
    CHECK (work_type IN ('review_report', 'deposition', 'trial_testimony')),
  logged_by UUID NOT NULL REFERENCES profiles(id),
  logged_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_case_time_entries_case_id ON case_time_entries(case_id);
CREATE INDEX idx_case_time_entries_logged_by ON case_time_entries(logged_by);

-- RLS
ALTER TABLE case_time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage time entries"
  ON case_time_entries FOR ALL USING (is_admin());

CREATE POLICY "Experts can view time entries on their cases"
  ON case_time_entries FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_time_entries.case_id
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

-- =============================================
-- 1D. case_activity_log table
-- =============================================
CREATE TABLE case_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  actor UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_case_activity_log_case_id ON case_activity_log(case_id);

-- RLS
ALTER TABLE case_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage activity log"
  ON case_activity_log FOR ALL USING (is_admin());

CREATE POLICY "Experts can view activity on their cases"
  ON case_activity_log FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_activity_log.case_id
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
