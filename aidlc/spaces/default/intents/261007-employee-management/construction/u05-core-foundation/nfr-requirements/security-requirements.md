# Security Requirements & Threat Mitigation — Unit U05 (u05-core-foundation)

## Sources
- Stories: `stories.md` (user-stories) — US5.1, US5.2
- Requirements: `requirements.md` (requirements-analysis) — NFR-2, NFR-3
- Contracts: `contract-summary.md` (contract-design)
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. Security Baseline & Threat Matrix

| Threat Category (STRIDE) | Attack Vector / Risk | Mitigation Strategy | Enforced Component |
|---|---|---|---|
| **Injection (Tampering)** | SQL injection via user inputs in search or mutations | 100% Parameterized SQL queries using `pg` prepared statements. Never concatenate raw SQL strings. | Database Client Repository |
| **Information Disclosure** | Unhandled stack traces leaked to client in production | Global error middleware intercepts all errors and outputs sanitized `{ success: false, error: { code, message } }`. | `errorHandler.ts` Middleware |
| **Cross-Site Scripting (XSS)** | Malicious scripts injected via text fields | React automatic DOM escaping for all rendered text; Helmet CSP (Content Security Policy) headers. | Express App & React Views |
| **Denial of Service (DoS)** | Unbounded request body or payload flood | Express JSON body parser size limit (`10mb` max for avatar uploads); connection pool sizing (`max: 20`). | Server Bootstrap Config |
| **Data Privacy (PDPA)** | Unauthorized exposure of employee PII and photos | Access controls on photo upload directory; strict database constraints. | Static Asset Route & DB |

---

## 2. Security Verification & Compliance

- **SQL Injection Tests**: Automated tests attempting SQL injection payloads (`' OR 1=1 --`) in queries to verify syntax rejection or safe escaping.
- **Header Verification**: Automated check confirming Helmet security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`).
- **Input Sanitization**: Positive age validation and non-empty string trimming before DB writes.
