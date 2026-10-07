# CI/CD Pipeline Specification — u01-employee-directory

## 1. Branching & Release Strategy

### 1.1 Branch Model
- `feature/*`: Development branch per feature/unit slice.
- `staging`: Integration environment branch for automated end-to-end and pre-release validation.
- `dev`: Active continuous integration mainline.
- `main`: Production release branch.

```mermaid
gitGraph
   commit id: "Init"
   branch dev
   checkout dev
   commit id: "dev baseline"
   branch "feature/u01-directory"
   checkout "feature/u01-directory"
   commit id: "u01 implementation"
   commit id: "u01 test suite"
   checkout dev
   merge "feature/u01-directory" id: "merge PR"
   branch staging
   checkout staging
   merge dev id: "staging promotion"
   checkout main
   merge staging id: "prod release"
```

## 2. Automated Pipeline Stages

### 2.1 Continuous Integration (Pull Request Workflow)
On every pull request targeting `dev`, `staging`, or `main`:
1. **Checkout & Dependency Cache**: Fetch repository code and restore `node_modules` cache.
2. **Code Quality & Linting**: Run `npm run lint` (`eslint . --ext .ts,.tsx`).
3. **Type Verification**: Run `npm run typecheck` (`tsc --noEmit`).
4. **Automated Testing**: Run `npm test` (`vitest run --coverage`). All tests must pass with 100% assertions satisfied.
5. **Build Verification**: Run `npm run build` to verify clean production compilation without bundler warnings.

### 2.2 Deployment & Release Promotion
- **Staging Deployment**: Triggered automatically upon merge into `staging`. Deploy container/build to staging cluster, verify health endpoint (`/health/ready`).
- **Production Deployment**: Triggered upon release tag or merge to `main` with approval gate. Database schema updates applied by DBA prior to application container switch.

