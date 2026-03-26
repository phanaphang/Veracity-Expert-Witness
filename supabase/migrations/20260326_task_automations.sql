-- Add automations JSONB column to case_tasks
-- Stores optional automation rules that fire on task start or completion
-- NULL when no automations are configured

ALTER TABLE case_tasks ADD COLUMN automations JSONB DEFAULT NULL;
