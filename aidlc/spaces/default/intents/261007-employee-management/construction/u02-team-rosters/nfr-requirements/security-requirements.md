# Security Requirements — Unit 02 (Team Rosters)

## Security Controls
- **SQL Injection Prevention**: All queries to `teams` and `employee_teams` must use parameterized placeholders (`$1, $2, ...`). Direct string concatenation in SQL queries is strictly prohibited.
- **Input Validation**: Team name, description, department, and member roles must be strictly validated using Zod schemas before reaching the database repository.
- **Foreign Key Validation**: Assigning an employee to a team must verify that both `team_id` and `employee_id` exist, preventing dangling foreign key references.
- **Error Sanitization**: Foreign key constraint failures and database exceptions must be caught and returned as clean `AppError` payloads without leaking internal database schema details.
