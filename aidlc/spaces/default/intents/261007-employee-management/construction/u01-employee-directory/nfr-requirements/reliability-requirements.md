# Reliability Requirements: Employee Directory (u01-employee-directory)

## 1. Availability & Data Durability Targets

| ID | Parameter | Requirement Target | Implementation Mechanism | Verification Method |
|---|---|---|---|---|
| **NFR2.1** | Transaction Safety | 100% atomic consistency across employee profile and team junction writes | ACID PostgreSQL transactions with automatic ROLLBACK on failure | Transaction Rollback Unit & Integration Tests |
| **NFR2.2** | Referential Integrity | Zero orphan team memberships upon employee deletion | `ON DELETE CASCADE` foreign key constraints in schema | Database Constraint Violation Tests |
| **NFR2.3** | Service Availability (SLO) | 99.9% uptime during business hours | Connection pooling with auto-reconnect and health checks | Health endpoint ping tests |
| **NFR2.4** | Graceful Error Recovery | Clear client error messages on connection loss | Standard HTTP 500/503 envelopes with retry advice | Mocked Database Disconnection Tests |

---

## 2. Fault Tolerance & Fallback Modes

- **Database Transient Failure**: Connection pool attempts automatic reconnection with exponential backoff.
- **Avatar Missing / Corrupt**: Client UI falls back gracefully to default initials avatar without throwing rendering exceptions.

