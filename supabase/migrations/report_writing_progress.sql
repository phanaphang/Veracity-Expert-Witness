-- ============================================================
-- MIGRATION: report_writing_progress
-- Tracks per-user progress through the
-- "Writing an Expert Witness Testimony Report"
-- training module.
-- ============================================================

-- 1. Table
CREATE TABLE IF NOT EXISTS report_writing_progress (
  id                    uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id             text,
  completed             boolean       NOT NULL DEFAULT false,
  completed_at          timestamptz,
  quiz_score            jsonb,
  scenario_choice       jsonb,
  assessment_score      integer,      -- reserved for future use; not written by current module
  certificate_name      text,
  certificate_issued_at timestamptz,
  created_at            timestamptz   NOT NULL DEFAULT now(),
  updated_at            timestamptz   NOT NULL DEFAULT now()
);

-- Index for fast per-user look-ups
CREATE INDEX IF NOT EXISTS report_writing_progress_user_id_idx
  ON report_writing_progress (user_id);

-- ============================================================
-- 2. updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_report_writing_progress_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_report_writing_progress_updated_at ON report_writing_progress;
CREATE TRIGGER set_report_writing_progress_updated_at
  BEFORE UPDATE ON report_writing_progress
  FOR EACH ROW EXECUTE FUNCTION update_report_writing_progress_updated_at();

-- ============================================================
-- 3. Row-Level Security
-- ============================================================

ALTER TABLE report_writing_progress ENABLE ROW LEVEL SECURITY;

-- is_admin_or_staff() is defined in the training_progress.sql migration
-- and is shared across all training modules.  If deploying this migration
-- independently, ensure that function exists first, or recreate it here:
--
-- CREATE OR REPLACE FUNCTION is_admin_or_staff()
-- RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
--   SELECT EXISTS (
--     SELECT 1 FROM profiles
--     WHERE id = auth.uid()
--       AND role IN ('admin', 'staff')
--   );
-- $$;

-- Experts: SELECT, INSERT, UPDATE only their own rows
CREATE POLICY "Experts can select own report writing progress"
  ON report_writing_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Experts can insert own report writing progress"
  ON report_writing_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Experts can update own report writing progress"
  ON report_writing_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins / staff: read-only access to all rows (for oversight)
CREATE POLICY "Admins and staff can select all report writing progress"
  ON report_writing_progress FOR SELECT
  USING (is_admin_or_staff());

-- No DELETE policy -- rows are never deleted (audit trail)
-- No public access -- all policies require auth.uid() to resolve
