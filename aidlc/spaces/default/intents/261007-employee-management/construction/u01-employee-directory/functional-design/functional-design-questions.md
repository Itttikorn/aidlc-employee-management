# Functional Design Questions — u01-employee-directory

## Focus: Employee Directory & Profile Management

### Q1: Avatar Upload & Storage Policy
How should avatar image uploads, formats, and fallbacks be handled?
- A. Support JPEG, PNG, and WebP up to 5MB, store on local disk with unique hashed filename, and fallback to initials/default avatar SVG if none provided (Recommended)
- B. Strict JPEG/PNG only up to 2MB, store in local filesystem, fallback to default avatar SVG
- C. Store avatars as Base64 data strings directly in database
- D. Disallow custom photo uploads; generate deterministic robotic/abstract avatars from email/name
- X. Other (please specify)

[Answer]:C

---

### Q2: Search & Filter Matching Mechanics
How should real-time search and team filtering operate across the employee directory?
- A. Real-time case-insensitive substring search matching both `full_name` and `position`, combined with optional single or multi-team filter dropdown via SQL query parameters (Recommended)
- B. Full-text search index (`tsvector`) on name, position, and bio with exact team matching
- C. Client-side in-memory search and filtering across pre-fetched employee dataset
- D. Prefix-only search on employee `full_name` with strict single team filtering
- X. Other (please specify)

[Answer]:A

---

### Q3: Employee Deletion & Referential Handling
How should employee profile deletion be handled in relation to team memberships and task allocations?
- A. Hard delete with transactional cascading removal of `employee_teams` junction rows; preserve team records and disallow delete if assigned to active tasks (Recommended)
- B. Soft delete (set `is_deleted = true` / `deleted_at = timestamp`), retaining all historical team allocations and completed tasks
- C. Cascade delete employee and all related tasks automatically
- D. Archive employee record into dedicated archive table before removing from active directory
- X. Other (please specify)

[Answer]:A

---

### Q4: Directory View & Pagination Strategy
What pagination and display strategy should the Employee Directory employ for Card Grid and Table views?
- A. Standard server-side pagination with 12 items per page for Card Grid (responsive 3-column) and 25 items per page for Table view, with total count metadata (Recommended)
- B. Infinite scroll with cursor-based pagination loading 20 items per scroll batch
- C. Load all records (suitable for small-medium orgs < 500 employees) with client-side pagination and instantaneous instant-filtering
- D. Fixed page size of 50 items across both Card Grid and Table views with traditional numeric page bar
- X. Other (please specify)

[Answer]:A

---

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct

