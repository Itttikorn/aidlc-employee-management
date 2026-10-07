# RAID Log: Employee Management Web Application

## Risks (R)

| ID | Risk Description | Severity | Likelihood | Mitigation Strategy | Source |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **R-01** | Multi-team task and membership state inconsistencies during concurrent updates | Medium | Low | Use PostgreSQL relational constraints, foreign keys, and atomic database transactions | [Q1] [Q5] |
| **R-02** | Dashboard query slowdown as employee, team, and task record counts increase | Low | Medium | Utilize indexed database columns (`team_id`, `status`, `employee_id`) and optimized summary aggregation queries | [Q1] [Q5] |
| **R-03** | PDPA non-compliance regarding unvalidated employee photo/data storage | Medium | Low | Enforce strict internal role-based access and secure data handling in compliance with Thailand's PDPA | [Q3] |
| **R-04** | Broken or missing profile image URLs degrading directory aesthetic | Low | Medium | Implement robust client-side fallback image handlers and generated avatar placeholder URLs | [Q2] |

## Assumptions (A)

| ID | Assumption Description | Impact if Invalid | Validation Plan | Source |
| :--- | :--- | :--- | :--- | :--- |
| **A-01** | PostgreSQL is available and deployable for the target runtime environment | Medium | Confirm database connection strings and migration scripts during Inception/Construction | [Q1] |
| **A-02** | Employee tasks strictly follow 3 stages (`Todo`, `Pending`, `Completed`) without requiring dynamic custom sub-stages in v1 | Low | Validated with project scope and stakeholder requirements | [desc] [Q5] |

## Issues (I)

| ID | Issue Description | Status | Resolution Action | Source |
| :--- | :--- | :--- | :--- | :--- |
| **I-01** | Current reliance on spreadsheets causes operational blind spots and manual coordination delays | Open | Developing and deploying the custom unified Employee Management web application | [Q1] [Q3] |

## Dependencies (D)

| ID | Dependency Description | Type | Owner | Impact | Source |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-01** | PostgreSQL database service/instance availability | Technical | Infrastructure / Dev | Unlocks database schema migrations and persistent operations | [Q1] |
| **D-02** | Modern browser client compatibility (HTML5 / ES6+ / CSS Modern Layout) | Platform | Frontend | Standard evergreen web browser support | [Q4] |

## Assumptions & Open Questions

None.
