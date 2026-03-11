-- ============================================================
-- MIGRATION: training_progress
-- Tracks per-user progress through the Expert Witness
-- Foundations training module.
-- ============================================================

-- 1. Table
CREATE TABLE IF NOT EXISTS training_progress (
  id                    uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id             text,
  completed             boolean       NOT NULL DEFAULT false,
  completed_at          timestamptz,
  quiz_scores           jsonb,
  scenario_choices      jsonb,
  certificate_name      text,
  certificate_issued_at timestamptz,
  created_at            timestamptz   NOT NULL DEFAULT now(),
  updated_at            timestamptz   NOT NULL DEFAULT now()
);

-- Index for fast per-user look-ups
CREATE INDEX IF NOT EXISTS training_progress_user_id_idx
  ON training_progress (user_id);

-- ============================================================
-- 2. updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_training_progress_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_training_progress_updated_at ON training_progress;
CREATE TRIGGER set_training_progress_updated_at
  BEFORE UPDATE ON training_progress
  FOR EACH ROW EXECUTE FUNCTION update_training_progress_updated_at();

-- ============================================================
-- 3. Row-Level Security
-- ============================================================

ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;

-- Helper: is the calling user an admin or staff member?
-- Reuses the same pattern as is_admin() on the profiles table.
CREATE OR REPLACE FUNCTION is_admin_or_staff()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'staff')
  );
$$;

-- Experts: full CRUD on their own rows only
CREATE POLICY "Experts can select own training progress"
  ON training_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Experts can insert own training progress"
  ON training_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Experts can update own training progress"
  ON training_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins / staff: read-only access to all rows (for oversight)
CREATE POLICY "Admins and staff can select all training progress"
  ON training_progress FOR SELECT
  USING (is_admin_or_staff());

-- No DELETE policy — rows are never deleted (audit trail)
-- No public access — all policies require auth.uid() to resolve
