-- Add admin policy to task_comment_reads as a fallback
-- The existing "Users can manage own read timestamps" policy should work,
-- but this ensures admins/staff can always manage their read timestamps
CREATE POLICY "Admins can manage all comment reads"
  ON task_comment_reads FOR ALL USING (is_admin());
