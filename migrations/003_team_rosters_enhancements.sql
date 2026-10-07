-- ==============================================================================
-- Migration: 003_team_rosters_enhancements.sql
-- Description: Adds department, team lead support, member roles, and indexes for teams
-- ==============================================================================

-- 1. Extend Teams table with department and optional team lead reference
ALTER TABLE teams 
  ADD COLUMN IF NOT EXISTS department VARCHAR(100) NOT NULL DEFAULT 'Engineering',
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES employees(id) ON DELETE SET NULL;

-- 2. Extend Employee Teams junction table with role and assignment timestamp
ALTER TABLE employee_teams 
  ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'Core Member',
  ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 3. High-performance indexes
CREATE INDEX IF NOT EXISTS idx_teams_department ON teams(department);
CREATE INDEX IF NOT EXISTS idx_teams_name ON teams(name);
CREATE INDEX IF NOT EXISTS idx_teams_lead_id ON teams(lead_id);
CREATE INDEX IF NOT EXISTS idx_employee_teams_team_id ON employee_teams(team_id);
CREATE INDEX IF NOT EXISTS idx_employee_teams_employee_id ON employee_teams(employee_id);
