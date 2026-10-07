# Risk Analysis & Bolt Sequencing Rationale

## Sources
- Bolt Plan: `bolt-plan.md` (delivery-planning)
- Unit Dependency DAG: `unit-of-work-dependency.md` (units-generation)
- Architecture Decisions: `decisions.md` (domain-design)
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. Sequencing Strategy & Heuristic Model

We adopt a **Walking-Skeleton-First and Value-Driven Sequencing Model** grounded in principles from Cockburn (Walking Skeleton) and Reinertsen (Weighted Shortest Job First / WSJF).

A **Walking Skeleton** is the smallest viable implementation that connects all architectural layers end-to-end (database persistence &rarr; backend API &rarr; frontend UI rendering) and proves that the system architecture functions cohesively before extensive feature code is added.

---

## 2. Economic & Risk Scoring Matrix (WSJF Analysis)

**WSJF (Weighted Shortest Job First)** calculates delivery priority by dividing Cost of Delay (User-Business Value + Time Criticality + Risk Reduction / Opportunity Enablement) by Job Size / Complexity.

| Bolt # | Unit / Scope | User Value (1-10) | Time Criticality (1-10) | Risk Reduction (1-10) | Total CoD | Job Size (1-10) | WSJF Score | Priority Rank |
|---|---|---|---|---|---|---|---|---|
| **Bolt 1** | `U05` (Core Foundation) | 8 | 9 | 10 | 27 | 4 | **6.75** | **1** |
| **Bolt 2** | `U01` (Employee Directory) | 10 | 9 | 8 | 27 | 5 | **5.40** | **2** |
| **Bolt 3** | `U02` (Team Rosters) | 8 | 7 | 6 | 21 | 4 | **5.25** | **3** |
| **Bolt 4** | `U03` (Task Management) | 9 | 8 | 6 | 23 | 5 | **4.60** | **4** |
| **Bolt 5** | `U04` (Executive Analytics) | 7 | 6 | 5 | 18 | 4 | **4.50** | **5** |

---

## 3. Rationale Breakdown

1. **Why Bolt 1 (`U05`) Ships First**:
   - *Risk Elimination*: Establishes PostgreSQL schema migrations, connection pooling, and error middleware. Discovering database container issues or connection latency early prevents rework across subsequent feature units.
2. **Why Bolt 2 (`U01`) Ships Second (Completing the Walking Skeleton)**:
   - *Core Entity Validation*: Employees are the central root entity of the system. Proving full-stack employee CRUD with photo uploads confirms the UI layout, API routing, and database write paths.
3. **Why Bolt 3 (`U02`) Precedes Tasks & Analytics**:
   - *Relational Prerequisite*: Tasks (`U03`) require active functional teams to be assigned to. Implementing team rosters first satisfies relational foreign key dependencies naturally.
4. **Why Bolt 4 (`U03`) Precedes Analytics**:
   - *Workflow State Machine*: Task lifecycle data (`Todo`, `Pending`, `Completed`) feeds directly into executive completion metrics and workload calculations.
5. **Why Bolt 5 (`U04`) Ships Last**:
   - *Aggregation Sink*: Analytics operates as a read-only projection across all underlying tables (`employees`, `teams`, `tasks`). Implementing it last guarantees rich operational test data is already populated.

