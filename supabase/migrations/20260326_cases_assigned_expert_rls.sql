-- Allow experts to view cases where they are the assigned expert
-- (Previously only checked case_invitations; now also checks assigned_expert)
DROP POLICY IF EXISTS "Experts can view cases they're invited to" ON cases;

CREATE POLICY "Experts can view cases they're invited to" ON cases FOR SELECT USING (
  assigned_expert = auth.uid()
  OR EXISTS (
    SELECT 1 FROM case_invitations
    WHERE case_id = cases.id AND expert_id = auth.uid()
  )
);
