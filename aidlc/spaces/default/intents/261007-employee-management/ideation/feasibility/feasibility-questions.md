# Feasibility & Constraints Questions

## Sources

- [desc] Initial description: "Create employee management web application"
- [scope] Workflow-selected scope: `enterprise`.
- [intent:IS] `aidlc/spaces/default/intents/261007-employee-management/ideation/intent-capture/intent-statement.md`: "The organization requires a unified web portal to centralize fragmented employee records, team assignments, and task tracking workflows."
- [market:CA] `aidlc/spaces/default/intents/261007-employee-management/ideation/market-research/competitive-analysis.md`: "Single pane of glass integrating employee directory, multi-team membership, 3-stage task boards, and company analytics dashboard"

## Q1. What existing backend infrastructure or data storage constraints apply to this initial deployment?
A. Self-contained web application with local/in-memory or file-backed storage (fastest setup, zero external database setup required)
B. Standard relational/document database (e.g. SQLite, PostgreSQL, MongoDB)
C. Cloud-native serverless architecture (e.g. AWS Lambda, DynamoDB, S3 for images)
D. Not yet defined
X. Other (please specify)

[Answer]: B, PostgreSQL

## Q2. How should employee profile pictures and binary assets be managed and stored?
A. Local filesystem storage / Base64 / embedded assets with fallback generated avatar URLs (e.g. Unsplash, DiceBear, UI Avatars)
B. Cloud object storage (e.g. Amazon S3 or compatible blob store)
C. External CDN / hosted image URLs
D. Not yet defined
X. Other (please specify)

[Answer]: A

## Q3. Are there regulatory, privacy, or compliance constraints governing employee records?
A. Standard internal data privacy practices (employee names, positions, ages, photos restricted to authenticated/internal company use)
B. Strict regulatory compliance (GDPR/PDPA data residency and right-to-be-forgotten controls)
C. Standard non-sensitive internal operational data with basic role segregation
D. None / Open internal demonstration environment
E. Not yet defined
X. Other (please specify)

[Answer]: B, Thailand's PDPA.

## Q4. What target client environments and browsers must be supported?
A. Modern desktop and tablet browsers (Chrome, Firefox, Edge, Safari) with responsive mobile layout
B. Desktop-only internal administrative workstations
C. Mobile-first responsive web client
D. Not yet defined
X. Other (please specify)

[Answer]: A

## Q5. What are the key technical or delivery risks identified for this initiative?
A. Data consistency across multi-team assignments and team-specific task stage transitions
B. Managing clean state synchronization between employee directory, team lists, task boards, and company dashboard
C. UI rendering performance and responsiveness with rich dynamic animations and data visualizations
D. Low overall technical risk — standard web architecture with well-defined domain boundaries
E. Not yet defined
X. Other (please specify)

[Answer]: All

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
