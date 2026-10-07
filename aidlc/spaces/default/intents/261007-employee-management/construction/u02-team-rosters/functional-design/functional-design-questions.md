# Functional Design Questions — u02-team-rosters

## Focus: Team Rosters & Multi-Team Allocations

### Q1: Team Entity & Department Structure
How should the Team entity and departmental structure be modeled?
- A. Teams with name, description, department (Engineering, Design, Product, etc.), and optional team lead assignment (Recommended)
- B. Simple Teams with name and description only
- C. Multi-tier organizational units with nested parent-child teams
- X. Other (please specify)

[Answer]:A

---

### Q2: Member Allocation Model
What employee-to-team membership allocation rules should we enforce?
- A. Multi-team membership with dedicated team role/tagging (e.g., Lead, Core Member, Contributor) (Recommended)
- B. Multi-team membership with generic association (no per-team roles)
- C. Single-team strict allocation (an employee belongs to at most one team)
- X. Other (please specify)

[Answer]:A

---

### Q3: Team Deletion Referential Policy
How should team deletion be handled regarding member allocations and tasks?
- A. Transactional cascade: delete team and unlink all members (preserves employee profiles and logs warning if active tasks exist) (Recommended)
- B. Restricted delete: prevent team deletion if active members or tasks are assigned
- C. Soft delete: mark team as archived/inactive while preserving historical allocations
- X. Other (please specify)

[Answer]:A

---

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
