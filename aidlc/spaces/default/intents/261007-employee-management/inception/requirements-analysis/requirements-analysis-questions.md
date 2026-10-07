# Stage 2.3: Requirements Analysis Questions

## Sources
- Initial description: [desc]
- Scope definition: [scope]
- Intent backlog: [backlog]
- Wireframes & mockups: [mockups]
- Team practices: [practices]

---

## Questions

### Q1: Employee Data Fields & Validation Rules
What are the mandatory fields and constraints for employee profile management?
- [x] A. Name (string), Position (string), Age (positive integer), Profile Picture (image file upload/preview), and Thai PDPA consent checkbox [desc] [constraints]
- [ ] B. Name and email only
- [ ] X. Other (please specify)
[Answer]: A, don't need the PDPA consent checkbox, all employees' consent should already be given if they are in our company.

### Q2: Multi-Team Membership Model
How should the employee-to-team relationship be structured?
- [x] A. Flexible Many-to-Many relational model where an employee can belong to multiple teams simultaneously [desc] [scope]
- [ ] B. Strict One-to-Many model (one employee belongs to only one team)
- [ ] X. Other (please specify)
[Answer]: A

### Q3: Task Lifecycle & Transition Rules
What are the allowed status transitions for team tasks?
- [x] A. Strict 3-stage lifecycle: `Todo` &rarr; `Pending` &rarr; `Completed` (tasks are assigned to specific teams) [desc] [scope]
- [ ] B. Free-form custom statuses
- [ ] X. Other (please specify)
[Answer]: A

### Q4: Dashboard Analytics Metrics
What aggregate metrics must the executive dashboard calculate and display in real time?
- [x] A. Total employee count, active team count, total tasks count, overall completion rate %, task stage breakdown (`Todo`/`Pending`/`Completed`), and per-team task distribution [desc] [mockups]
- [ ] B. Basic counts only
- [ ] X. Other (please specify)
[Answer]: A

### Q5: System Architecture & Visual Design
What architectural and UI constraints govern the application?
- [x] A. PostgreSQL database backend, REST API services, responsive web frontend with solid opaque cards (**strictly no glassmorphism**), and PDPA privacy controls [desc] [practices]
- [ ] B. In-memory data store with glassmorphism UI
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
