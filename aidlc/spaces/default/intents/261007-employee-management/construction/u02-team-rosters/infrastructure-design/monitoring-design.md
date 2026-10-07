# Monitoring & CI/CD Pipeline Alignment — Unit 02 (Team Rosters)

## Monitoring & Health Checks
- **Health Verification**: Query performance on `GET /api/teams` tracked via debug logs (`src/utils/logger.ts`).
- **Database Connection Metrics**: Monitored via `/api/health` endpoint.

## CI/CD Pipeline Integration
- **Migration Automation**: `003_team_rosters_enhancements.sql` is automatically discovered and applied during `npm run migrate` in the GitHub Actions `test-and-coverage` job.
- **Automated Tests**: Unit & API tests for Team management run as part of `vitest run --coverage`.
