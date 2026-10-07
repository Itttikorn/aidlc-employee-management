---
description: Git branching strategy, atomic conventional commits, and cost-effective CI workflow rules
globs: ["**/*"]
---

# Git Workflow & Commit Rules

## 1. Multi-Branch Tiered Promotion
- **Feature Branches**: All feature work and changes must occur in `feature/<feature-name>`.
- **Staging**: Integration and pre-merge verification branch.
- **Dev**: Development consolidation branch for verified features.
- **Main**: Production release branch (receives merges from `dev` only).
- **Mandate**: NEVER commit directly to `main`. Always follow the promotion chain: `feature/*` -> `staging` -> `dev` -> `main`.

## 2. Atomic Conventional Commits
- Monolithic commits containing unrelated changes are strictly forbidden.
- Structure commits into atomic units using Conventional Commits prefixes:
  - `feat(<scope>):` Feature additions
  - `fix(<scope>):` Bug fixes
  - `test:` Unit, integration, and API test suites
  - `ci:` GitHub Actions, CI configurations, and quality gates
  - `chore(<scope>):` Docker, build scripts, dependencies, scaffolding
  - `docs(<scope>):` Documentation, architecture specs, and audit records

## 3. Cost-Effective CI Triggering
- CI pipelines must only execute on:
  - `push` to `dev` and `main`
  - `pull_request` targeting `dev` and `main`
- CI runs must NOT be triggered on individual `feature/**` or `staging` pushes.
