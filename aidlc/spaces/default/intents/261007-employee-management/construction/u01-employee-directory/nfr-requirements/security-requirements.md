# Security & Compliance Requirements: Employee Directory (u01-employee-directory)

## 1. Security & PDPA Requirements

| ID | Category | Requirement | Mitigation / Control | Verification Method |
|---|---|---|---|---|
| **NFR4.1** | PDPA Compliance & PII Protection | Employee profile data (full name, age, photo) must be protected against unauthorized modification or scraping. | Access restricted to authenticated enterprise sessions; CORS origin lockdown. | Automated Security Headers & Access Tests |
| **NFR4.2** | Input Sanitization & Injection Prevention | Prevent SQL injection and Cross-Site Scripting (XSS) in user-provided strings. | Strict parameterized queries via `pg` pool; Zod input schema validation stripping HTML tags. | Automated Pentest & Malicious Input Test Suite |
| **NFR4.3** | File & Avatar Upload Security | Protect backend against arbitrary file execution and buffer overflow via avatar data. | Base64 MIME validation (`data:image/(jpeg|png|webp);base64,...`) and strict 5MB payload limit. | Upload Vulnerability & Invalid Payload Tests |
| **NFR4.4** | Denial of Service Protection | Prevent endpoint exhaustion via large body spam. | Express body-parser size limit set to 6MB max for JSON/urlencoded payloads. | Body Limit Error (413) Verification Tests |

---

## 2. Threat Modeling (STRIDE Analysis)

- **Spoofing**: Unauthenticated callers attempting to mutate records &rarr; Enforce internal network/CORS restrictions and session headers.
- **Tampering**: Modifying employee age to invalid numbers or injecting scripts into position title &rarr; Server-side Zod validation with strict positive integer constraints and string length trimming.
- **Information Disclosure**: Exposing internal database errors with credentials or stack traces &rarr; Centralized error handler returning sanitized `{ success: false, error: { message, code } }` envelopes in production.
- **Denial of Service**: Uploading massive 50MB Base64 strings to exhaust Node.js heap &rarr; Payload limit middleware rejecting oversized requests before processing.

