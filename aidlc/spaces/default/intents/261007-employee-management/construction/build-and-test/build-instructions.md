# Build Instructions — Employee Management System

## 1. Prerequisites & Environment Setup

### 1.1 Runtime & Tooling
- **Node.js**: >= 20.0.0 LTS
- **Package Manager**: `npm` (v10+)
- **Database**: PostgreSQL (v15+)

### 1.2 Configuration Files
1. Copy the sample environment file:
   ```bash
   cp .env.example .env
   ```
2. Ensure database credentials match your PostgreSQL instance:
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/employee_management
   CORS_ORIGIN=http://localhost:5173
   LOG_LEVEL=info
   ```

## 2. Build & Compilation Commands

### 2.1 Dependency Installation
Install all production and development dependencies:
```bash
npm install
```

### 2.2 Database Schema Migrations
Execute PostgreSQL transactional migrations:
```bash
npm run migrate
```

### 2.3 Type Checking
Validate strict TypeScript typings with no emissions:
```bash
npm run typecheck
```

### 2.4 Production Build
Compile TypeScript to production JavaScript in `dist/`:
```bash
npm run build
```

### 2.5 Execution
- **Development Server**: `npm run dev`
- **Production Server**: `npm start`

