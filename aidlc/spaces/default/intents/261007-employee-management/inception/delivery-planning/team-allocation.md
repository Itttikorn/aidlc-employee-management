# Team Allocation & Mob Ownership Plan

## Sources
- Bolt Plan: `bolt-plan.md` (delivery-planning)
- Unit Definitions: `unit-of-work.md` (units-generation)
- Scope Definition: `scope-definition.md` (ideation)
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. Staffing Model Overview

In accordance with the **MVP scope** configuration (where human team formation stage 1.5 was skipped), all Construction Bolts are executed in-session by the primary AI developer agent (`aidlc-developer-agent`), supported by domain and review personas.

A **mob** is an autonomous swarm or pairing structure of expert agent personas collaborating on a specific slice of work.

| Bolt # | Bolt Name | Primary Mob Lead | Support Agents | Verification Authority |
|---|---|---|---|---|
| **Bolt 1** | System Foundation & Persistence (`U05`) | `aidlc-developer-agent` | `aidlc-architect-agent`, `aidlc-devsecops-agent` | Automated Test Suite (`npm test`) |
| **Bolt 2** | Employee Profile & Directory (`U01`) | `aidlc-developer-agent` | `aidlc-design-agent`, `aidlc-quality-agent` | Automated Test Suite (`npm test`) |
| **Bolt 3** | Team Rosters & Allocations (`U02`) | `aidlc-developer-agent` | `aidlc-design-agent`, `aidlc-quality-agent` | Automated Test Suite (`npm test`) |
| **Bolt 4** | 3-Stage Task Management (`U03`) | `aidlc-developer-agent` | `aidlc-design-agent`, `aidlc-quality-agent` | Automated Test Suite (`npm test`) |
| **Bolt 5** | Executive Dashboard Analytics (`U04`) | `aidlc-developer-agent` | `aidlc-architect-agent`, `aidlc-design-agent` | Automated Test Suite (`npm test`) |

---

## 2. Construction Roles & Responsibilities

- **Developer Agent (`aidlc-developer-agent`)**: Authors TypeScript backend services, Express route controllers, React components, and automated test-after verification suites.
- **Architect Agent (`aidlc-architect-agent`)**: Verifies domain model fidelity, schema normalization, and contract adherence.
- **Design Agent (`aidlc-design-agent`)**: Enforces UI design token adherence, ensuring crisp borders and strictly **zero glassmorphism or low-contrast backdrop blur**.
- **Quality Agent (`aidlc-quality-agent`)**: Ensures test coverage targets are met across unit and REST API integration tests.

