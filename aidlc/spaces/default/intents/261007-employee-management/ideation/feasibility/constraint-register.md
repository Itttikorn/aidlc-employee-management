# Constraint Register: Employee Management Web Application

## Technical Constraints

| ID | Constraint Category | Description | Rationale / Impact | Source |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Database Engine | Must use **PostgreSQL** relational database for persistence | Ensures strict relational integrity across many-to-many team assignments and task relations | [Q1] |
| **TC-02** | Profile Asset Storage | Must support local asset/Base64 storage with generated avatar fallback URLs | Enables self-contained deployments without external AWS S3/cloud blob dependencies | [Q2] |
| **TC-03** | Client Target | Must support all modern evergreen desktop and mobile browsers (Chrome, Firefox, Safari, Edge) | Guarantees accessibility for company-wide employees, leads, and executives | [Q4] |
| **TC-04** | Task Lifecycle States | Task status is strictly bound to 3 discrete stages: `Todo`, `Pending`, `Completed` | Enforces standard organizational workflow across all assigned teams | [desc] |

## Regulatory & Compliance Constraints

| ID | Constraint Category | Description | Rationale / Impact | Source |
| :--- | :--- | :--- | :--- | :--- |
| **RC-01** | Privacy & Data Protection | Must comply with **Thailand's PDPA** for employee personal data (name, age, position, photo) | Requires strict access control, secure storage, and legitimate business purpose enforcement | [Q3] |
| **RC-02** | Access Boundary | Employee directory and task data must be restricted to internal authenticated company access | Prevents unauthorized external data exposure | [Q3] |

## Organizational & Operational Constraints

| ID | Constraint Category | Description | Rationale / Impact | Source |
| :--- | :--- | :--- | :--- | :--- |
| **OC-01** | Scope Lifecycle | Enterprise AI-DLC lifecycle with comprehensive analysis, design, and verification | Ensures end-to-end traceability and production readiness | [scope] [Q4] |
| **OC-02** | Target Scale | Optimized for organizations spanning 10-250 employees across multiple teams | Guides database indexing, dashboard query performance, and UI layout density | [Q5] |

## Assumptions & Open Questions

None.
