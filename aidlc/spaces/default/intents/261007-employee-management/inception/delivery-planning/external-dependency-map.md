# External Dependency & Environmental Mapping

## Sources
- Bolt Plan: `bolt-plan.md` (delivery-planning)
- Component Catalogue: `components.md` (domain-design)
- Contracts Specification: `contract-summary.md` (contract-design)
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. External Dependencies Overview

Because this is a greenfield full-stack application developed within an AI-assisted environment, all external dependencies are self-contained and run locally via standard developer tooling.

| External Resource | Kind | Consuming Bolt(s) | Lead Time / Availability | Fallback / Mitigation |
|---|---|---|---|---|
| **PostgreSQL Database** | Relational Database | All Bolts (`Bolt 1`-`Bolt 5`) | Immediate (Local Docker container or local PostgreSQL daemon) | Automated containerized bootstrap scripts in `u05-core-foundation`. |
| **Node.js & npm Runtime** | Runtime Environment | All Bolts (`Bolt 1`-`Bolt 5`) | Available locally on developer host | Standard Node.js LTS engine specification in `package.json`. |
| **Local Avatar File Storage** | File System Storage | `Bolt 2: u01-employee-directory` | Immediate (Local `uploads/` directory with static express route) | S3/object storage abstraction interface ready for cloud deployments. |

---

## 2. Gated External Approvals & Blockers

| External Dependency | Owner / Provider | Impacted Unit | Blocking Risk | Status |
|---|---|---|---|---|
| None | Self-Contained | None | None | **Ready for Construction** |

