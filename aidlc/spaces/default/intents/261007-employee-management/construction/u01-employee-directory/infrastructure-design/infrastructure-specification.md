# Infrastructure Specification — u01-employee-directory

## 1. System Architecture & Topology

### 1.1 Compute & Runtime Environment
- **Runtime**: Node.js >= 20.x LTS.
- **Process Manager / Execution**:
  - Development: `tsx watch src/server.ts` with instant hot reloading.
  - Production: Native Node.js execution `node dist/server.js` compiled via TypeScript (`tsc`).
- **Containerization**: Standard single-stage or multi-stage Dockerfile packaging the production build.
- **Environment Isolation**: Dedicated environment configuration per stage (`development`, `staging`, `production`).

```mermaid
graph TD
    Client["Browser / SPA Client"] -->|HTTP / REST API| Express["Node.js Express Server (Port 3000)"]
    Express -->|Connection Pool (pg)| Postgres[("PostgreSQL Database (Port 5432)")]
    Express -->|Base64 in JSON| DBStore["PostgreSQL employees table"]
```

### 1.2 Configuration Management
Environment variables must be supplied via process environment or `.env` file (loaded via `dotenv` in dev mode):

| Variable | Type | Description | Default / Example |
|---|---|---|---|
| `PORT` | Number | HTTP listening port | `3000` |
| `NODE_ENV` | String | Runtime environment | `development` / `production` |
| `DATABASE_URL` | String | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/employee_management` |
| `LOG_LEVEL` | String | Logging verbosity | `info` / `debug` |
| `CORS_ORIGIN` | String | Allowed CORS origins | `http://localhost:5173` |

## 2. Storage & Database Infrastructure

### 2.1 Database Provisioning
- **Engine**: PostgreSQL 15+.
- **Database Name**: `employee_management`.
- **Connection Pooling**: `pg.Pool` with `max: 20`, `idleTimeoutMillis: 30000`, `connectionTimeoutMillis: 2000`.

### 2.2 Schema Management & Migrations
- **Strategy**: Manual execution of raw SQL scripts by database administrator across target environments.
- **Migration Scripts Directory**: `src/db/migrations/*.sql`.
- **Core Tables**:
  - `departments`: ID, name, description, timestamps.
  - `teams`: ID, department_id, name, description, timestamps.
  - `employees`: ID, department_id, full_name, email, position, avatar_base64, hire_date, timestamps.
  - `employee_teams`: employee_id, team_id, is_primary, assigned_at.
- **Integrity**: Foreign keys with `ON DELETE RESTRICT` for departments/teams, cascading transactions for junction rows.

## 3. Network & Security Architecture

### 3.1 Security Controls
- **Transport Security**: TLS 1.3 termination at reverse proxy or load balancer in staging/production.
- **Payload Constraints**: Express JSON parser configured with strict 2MB body limit (`express.json({ limit: '2mb' })`) to accommodate Base64 avatars while preventing resource exhaustion.
- **CORS Protection**: Whitelisted origin headers.
- **Input Sanitization**: Request body validation via schema validator / Zod schemas.

