# Stage 2.2: Practices Discovery Questions

## Sources
- Organization rules: [memory:org]
- State tracking: [state]
- Initial description: [desc]
- Scope definition: [scope]
- User feedback: [revision]

---

## Questions

### Q1: Way of Working & Branching Strategy
What branching and integration strategy will be used for this project?
- [x] A. Multi-stage promotion: develop on `feature/(feature_name)` -> merge to `staging` -> merge to `dev` -> merge to `main` [revision]
- [ ] B. Single trunk-based development directly to `main`
- [ ] X. Other (please specify)
[Answer]: A

### Q2: Walking Skeleton Stance
How should the first integrated delivery unit (Unit 01 / Unit 05 foundation) be verified before subsequent units?
- [x] A. Walking Skeleton: Build and verify the first integrated end-to-end slice with automated tests before scaling [memory:org]
- [ ] B. Parallel full build without walking skeleton checkpoint
- [ ] X. Other (please specify)
[Answer]: A

### Q3: Testing Posture & Coverage Standard
What testing methodology and coverage standard should be affirmed for this MVP?
- [x] A. Test-after methodology with comprehensive unit and integration tests covering business logic and API endpoints [memory:org]
- [ ] B. Test-Driven Development (TDD) strictly test-first
- [ ] C. Minimal happy-path tests only
- [ ] X. Other (please specify)
[Answer]: A

### Q4: Build & Execution Environment
What is the runtime and execution posture for local development and verification?
- [x] A. Node.js/TypeScript stack with PostgreSQL database, local dev server (`npm run dev`), and automated test runner (`npm test`) [desc]
- [ ] B. Containerized Docker compose environment only
- [ ] X. Other (please specify)
[Answer]: A

### Q5: Code Style & Conventions
What code formatting and quality standards should be enforced?
- [x] A. Strict TypeScript types, ESLint, and Prettier with zero unhandled any types and no glassmorphism UI styling rules [desc] [mockups]
- [ ] B. Relaxed linting rules
- [ ] X. Other (please specify)
[Answer]: A

---

## Assumptions & Open Questions
- None.

---

## Assumption Confirmation
- [x] A. Accept assumptions
- [ ] B. Convert to follow-up questions
[Answer]: A

---

## Consolidated Summary Confirmation
- [x] A. Looks correct
- [ ] B. Make corrections
[Answer]: Looks correct
