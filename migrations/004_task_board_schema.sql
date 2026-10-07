-- ==============================================================================
-- Migration: 004_task_board_schema.sql
-- Description: Creates / extends tasks table with 3-stage FSM and priority tagging
-- ==============================================================================

-- 1. Create tasks table if not existing
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Todo' CHECK (status IN ('Todo', 'Pending', 'Completed')),
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Schema compatibility migration if tasks table existed from earlier revision
DO $$
BEGIN
  -- Rename assigned_employee_id to assignee_id if old column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'assigned_employee_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'assignee_id'
  ) THEN
    ALTER TABLE tasks RENAME COLUMN assigned_employee_id TO assignee_id;
  END IF;
END $$;

-- 3. Ensure columns exist with constraints
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assignee_id UUID REFERENCES employees(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date DATE;

-- 4. High-performance indexes
CREATE INDEX IF NOT EXISTS idx_tasks_team_id ON tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
