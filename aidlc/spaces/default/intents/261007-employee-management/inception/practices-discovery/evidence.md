# Practices Discovery Evidence

## Sources
- Organization memory: [memory:org]
- State tracking: [state]
- Support agent contributions: [contributions]
- Consolidated questions: [questions]
- User revision feedback: [revision]

---

## Evidence & Participant Inputs

1. **Lead Agent (aidlc-pipeline-deploy-agent)**:
   - Evaluated greenfield setup against `org.md` framework defaults.
   - Updated branching model to tiered `feature/(feature_name)` &rarr; `staging` &rarr; `dev` &rarr; `main` promotion flow based on user feedback.
2. **Quality Agent (aidlc-quality-agent)**:
   - Assessed testing posture; recommended test-after methodology with comprehensive unit and integration coverage.
3. **Developer Agent (aidlc-developer-agent)**:
   - Evaluated layered TypeScript architecture and confirmed UI constraints (opaque solid cards, strictly no glassmorphism).
4. **DevSecOps Agent (aidlc-devsecops-agent)**:
   - Confirmed Thai PDPA compliance checks and static analysis / lint standards.
5. **Human Stakeholder Decisions**:
   - Specified custom multi-stage git promotion pipeline (`feature/(feature_name)` -> `staging` -> `dev` -> `main`).
   - Confirmed walking skeleton first slice, test-after posture, and strict TypeScript/lint standards.
