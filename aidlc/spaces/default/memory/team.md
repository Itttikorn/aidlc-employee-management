# Team-Level Rules

> This team's affirmed practices and corrections. Loaded after `org.md` as
> strict-additive guidance; contradictions with broader policy are rejected.
> Populated by the practices-discovery affirmation gate. Edit at the gate,
> not directly.

## Way of Working

We use a **tiered multi-branch promotion workflow via Pull Requests**:
1. **Feature Development**: Features are committed and developed into dedicated `feature/(feature_name)` branches.
2. **Pull Requests for Review**: Feature branches are pushed to remote and promoted by creating a Pull Request (PR) targeting `staging` (or `dev`).
3. **No Automated Merges**: Never automatically merge feature branches into higher branches (`staging`, `dev`, `main`). Always open a PR and wait for human review/approval.
4. **Staging Integration**: After PR review and merge into `staging`, integration tests and container verification are performed.
5. **Development Consolidation**: Staging changes are promoted to `dev` via PR for consolidated regression testing.
6. **Production Release**: Verified changes from `dev` are promoted to `main` via PR for final release.

## Walking Skeleton

We adopt a **walking skeleton** approach. The first integrated unit (Unit 01 & Unit 05 System Foundation) will be built and verified end-to-end with tests to prove system integration, PostgreSQL connectivity, and UI rendering before subsequent units are implemented.

## Testing Posture

We treat automated testing as a mandatory deliverable for all business logic and API endpoints.
- **Methodology**: test-after
- **Ordering**: Implement each feature layer (data access, API endpoint, UI component), then author and execute that layer's test suite to verify functionality and contract satisfaction.
- Test coverage standard: Unit tests for state management, entity models, validation rules, and integration tests for REST API endpoints.

## Guard Policy

<!-- Affirmed by the team. Mode: strict, relaxed, or off. Strict here holds for every intent and cannot be changed from chat. A section under the retired Change Control heading, written by an earlier release, is still read. -->

## Deployment

We support local and preview runtime execution using standard Node.js scripts (`npm run dev` for dev server, `npm test` for test suite, `npm run build` for production packaging).

## Code Style

- Strict TypeScript typings across all models, API controllers, and frontend views.
- ESLint and Prettier for automated formatting and static lint verification.
- Opaque solid card styling with clear high-contrast borders (**strictly no glassmorphism**).
- Full compliance with Thailand Personal Data Protection Act (PDPA) for employee records and avatars.

## Commit Standards

- Atomic Conventional Commits (`feat`, `fix`, `test`, `ci`, `chore`, `docs`).
- Zero monolithic all-in-one commits.

## CI Execution Policy

- Cost-effective triggers: CI runs on `pull_request` to `dev`/`main` and `push` to `dev`/`main`.
- No CI runs on intermediate `feature/**` or `staging` pushes.

## Forbidden

- Direct commits to `main` branch.
- Automated merges of feature branches into higher branches without Pull Request review.
- Monolithic commits bundling multiple unrelated concerns.
- Pushing unverified code without running local tests.

## Mandated

- Multi-branch promotion via Pull Requests: `feature/*` -> `staging` -> `dev` -> `main`.
- Always open Pull Requests for branch promotions; do not perform automated merges without human review.
- Conventional commits specification on all commit messages.

## Corrections

<!-- Self-learning loop appends here. -->
- Learned: Always create a Pull Request for branch integration rather than automatically merging feature branches. Wait for human review and approval.

