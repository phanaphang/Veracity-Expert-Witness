-- ============================================================
-- Administrative Projects & Tasks (not tied to cases)
-- ============================================================

-- 1. Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'archived')),
  owner UUID NOT NULL REFERENCES profiles(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_owner ON projects(owner);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL USING (is_admin());

-- 2. Project members join table
CREATE TABLE project_members (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, user_id)
);

ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage project members"
  ON project_members FOR ALL USING (is_admin());

-- 3. Project activity log
CREATE TABLE project_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  actor UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_project_activity_log_project_id ON project_activity_log(project_id);

ALTER TABLE project_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage project activity"
  ON project_activity_log FOR ALL USING (is_admin());

-- 4. Extend case_tasks to support project tasks
ALTER TABLE case_tasks
  ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE case_tasks ALTER COLUMN case_id DROP NOT NULL;

ALTER TABLE case_tasks
  ADD CONSTRAINT case_or_project_check
  CHECK (
    (case_id IS NOT NULL AND project_id IS NULL) OR
    (case_id IS NULL AND project_id IS NOT NULL)
  );

CREATE INDEX idx_case_tasks_project_id ON case_tasks(project_id);
