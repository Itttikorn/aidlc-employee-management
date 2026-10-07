# CI Pipeline Questions — ci-pipeline

## Focus: Continuous Integration & Quality Gates

### Q1: CI Automation Platform
Which CI/CD automation platform should we configure for this project?
- A. GitHub Actions workflow (.github/workflows/ci.yml) with Node 20 & PostgreSQL service container (Recommended)
- B. GitLab CI configuration (.gitlab-ci.yml)
- C. AWS CodePipeline / CodeBuild (buildspec.yml)
- D. Local/Generic Shell CI Script
- X. Other (please specify)

[Answer]:A

---

### Q2: Branch Triggering Strategy
What branch triggering strategy should the CI pipeline follow?
- A. Main branches and Pull Requests (push to main/master, pull_request to main/master) (Recommended)
- B. Push to all branches and pull requests
- C. Release tags and scheduled nightlies only
- X. Other (please specify)

[Answer]:A

---

### Q3: Quality Gate Enforcement
What quality gate enforcement level would you like to apply before merge?
- A. Strict Quality Gates (Linter + TypeScript Typecheck + Tests with >= 80% Coverage + Production Build) (Recommended)
- B. Standard Quality Gates (Typecheck + Tests + Build)
- C. Minimal (Build and Tests only)
- X. Other (please specify)

[Answer]:A

---

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
