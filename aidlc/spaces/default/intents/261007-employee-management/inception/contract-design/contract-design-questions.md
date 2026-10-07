# Contract Design — API & Inter-Unit Interface Questions

These questions define the API protocols, schema formats, error response envelopes, and contract ownership rules across all Units of Work.

---

### Question 1: REST API Protocol & Response Envelope Specification
How should the HTTP REST API responses and errors be standardized across all feature units?
- A. **Standardized JSON Envelope with HTTP Status Codes** — All successful responses return `{ success: true, data: T }` or JSON arrays; errors return standard `{ success: false, error: { code: string, message: string, details?: any } }` with semantic HTTP status codes (200, 201, 400, 404, 409, 500)
- B. Raw un-enveloped JSON payloads with custom status fields in the response body
- C. Other (please specify)
[Answer]: A

---

### Question 2: API Contract Ownership & Specification Format
What formal specification standard should be used to document the public/client API contracts?
- A. **OpenAPI 3.1 YAML Specification** — Unified, machine-readable OpenAPI schema detailing all endpoints (`/api/employees`, `/api/teams`, `/api/tasks`, `/api/dashboard/stats`) with request/response schemas, validation rules, and error envelopes
- B. Markdown endpoint tables only without OpenAPI schema definitions
- C. Other (please specify)
[Answer]: A

---

### Question 3: Inter-Unit Data Sharing & Relational Integrity
How should data contracts across units (e.g. employee-team assignments and team-task links) be enforced?
- A. **Shared PostgreSQL Relational Schema & Typed Interfaces** — Foreign key constraints enforced at the database level (`ON DELETE RESTRICT` for teams with active tasks; `ON DELETE CASCADE` for join tables), wrapped by shared TypeScript repository interfaces in `u05-core-foundation`
- B. Loose in-memory validation without database foreign keys
- C. Other (please specify)
[Answer]: A

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?
- Looks correct
- Request changes

[Answer]: Looks correct
