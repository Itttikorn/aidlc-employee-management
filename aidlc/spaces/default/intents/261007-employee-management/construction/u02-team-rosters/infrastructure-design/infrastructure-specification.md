# Infrastructure & Relational Schema Specification — Unit 02 (Team Rosters)

## Relational Schema (PostgreSQL Migration: `003_team_rosters_enhancements.sql`)

```sql
-- Teams Table Enhancements
ALTER TABLE teams ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'General';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES employees(id) ON DELETE SET NULL;

-- Employee Teams Junction Enhancements
ALTER TABLE employee_teams ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Core Member';
ALTER TABLE employee_teams ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Indexes for Fast Search & Filtering
CREATE INDEX IF NOT EXISTS idx_teams_department ON teams(department);
CREATE INDEX IF NOT EXISTS idx_teams_name ON teams(name);
CREATE INDEX IF NOT EXISTS idx_employee_teams_team_id ON employee_teams(team_id);
CREATE INDEX IF NOT EXISTS idx_employee_teams_employee_id ON employee_teams(employee_id);
```

## Performance & Optimization Strategy
- **Query Execution**: Combined `SELECT teams.*, JSON_AGG(json_build_object('id', e.id, 'name', e.full_name, 'email', e.email, 'avatarUrl', e.avatar_url, 'role', et.role)) AS members` with `GROUP BY teams.id` prevents N+1 queries.
- **Connection Handling**: Uses the centralized connection pool in `src/config/database.ts`.
