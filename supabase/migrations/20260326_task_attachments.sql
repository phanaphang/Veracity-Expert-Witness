-- =============================================
-- Task Attachments Migration
-- Adds: task_attachments table for per-task file uploads
-- Adds: task-attachments storage bucket with RLS
-- =============================================

CREATE TABLE task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES case_tasks(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_task_attachments_task_id ON task_attachments(task_id);
CREATE INDEX idx_task_attachments_uploaded_by ON task_attachments(uploaded_by);

-- RLS
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage task attachments"
  ON task_attachments FOR ALL USING (is_admin());

CREATE POLICY "Experts can view attachments on their case tasks"
  ON task_attachments FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM case_tasks
      JOIN cases ON cases.id = case_tasks.case_id
      WHERE case_tasks.id = task_attachments.task_id
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

-- Enforce max 10 attachments per task
CREATE OR REPLACE FUNCTION check_task_attachment_limit()
RETURNS trigger AS $$
BEGIN
  IF (SELECT count(*) FROM task_attachments WHERE task_id = NEW.task_id) >= 10 THEN
    RAISE EXCEPTION 'Maximum 10 attachments per task';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_task_attachment_limit
  BEFORE INSERT ON task_attachments
  FOR EACH ROW
  EXECUTE FUNCTION check_task_attachment_limit();

-- =============================================
-- Storage bucket: task-attachments
-- =============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'task-attachments',
  'task-attachments',
  false,
  10485760, -- 10MB
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
);

-- Storage RLS: admin/staff can upload
CREATE POLICY "Admins can upload task attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'task-attachments' AND is_admin()
);

-- Storage RLS: admin/staff and experts on the case can view
CREATE POLICY "Authorized users can view task attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'task-attachments' AND (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM case_invitations
      WHERE case_invitations.case_id = (string_to_array(name, '/'))[1]::uuid
      AND case_invitations.expert_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = (string_to_array(name, '/'))[1]::uuid
      AND cases.assigned_expert = auth.uid()
    )
  )
);

-- Storage RLS: admin/staff can delete
CREATE POLICY "Admins can delete task attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'task-attachments' AND is_admin()
);
