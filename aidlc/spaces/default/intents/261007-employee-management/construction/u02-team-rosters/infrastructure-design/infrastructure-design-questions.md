# Infrastructure Design Questions — u02-team-rosters

## Focus: Infrastructure, Relational Schema & Indexing for Team Rosters

### Q1: Schema Migration & Foreign Key Cascade
How should `teams` and `employee_teams` relational constraints be defined in PostgreSQL?
- A. `teams` table with `lead_id REFERENCES employees(id) ON DELETE SET NULL`, and `employee_teams` with `ON DELETE CASCADE` for both `employee_id` and `team_id` (Recommended)
- B. No foreign keys (application-managed integrity)
- C. Other (please specify)

[Answer]:A

---

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
