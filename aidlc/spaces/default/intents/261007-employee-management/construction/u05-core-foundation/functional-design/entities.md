# Entity Model — Unit U05 (u05-core-foundation)

## Sources
- Unit Definitions: `unit-of-work.md` (units-generation)
- Contracts: `contract-summary.md` (contract-design)
- Requirements: `requirements.md` (requirements-analysis)
- Stories: `stories.md` (user-stories)

---

## 1. Machine-Readable Entity Model

```yaml
entities:
  - name: DatabaseMigrationRecord
    description: Tracks executed database schema migration files and timestamps
    attributes:
      - name: id
        type: integer
        required: true
        unique: true
      - name: filename
        type: string
        required: true
        unique: true
      - name: executed_at
        type: timestamp
        required: true
        default: current_timestamp
    constraints:
      - "PRIMARY KEY (id)"
      - "UNIQUE (filename)"

  - name: ApiErrorEnvelope
    description: Standardized error envelope returned across all REST API failures
    attributes:
      - name: success
        type: boolean
        required: true
        default: false
      - name: code
        type: string
        required: true
      - name: message
        type: string
        required: true
      - name: details
        type: array
        required: false
    constraints:
      - "code must follow uppercase snake_case format"

  - name: DesignTokenConfig
    description: Global visual styling tokens for themes, contrast borders, and opaque surfaces
    attributes:
      - name: theme_mode
        type: string
        required: true
        allowed_values: [dark, light]
      - name: surface_card
        type: string
        required: true
      - name: border_contrast
        type: string
        required: true
      - name: text_primary
        type: string
        required: true
      - name: text_secondary
        type: string
        required: true
    constraints:
      - "Zero glassmorphism (no backdrop-filter or opacity overlays on card content)"
```

---

## 2. Entity Summary

| Entity | Purpose | Key Attributes | Constraints |
|---|---|---|---|
| **DatabaseMigrationRecord** | Idempotent schema migration tracking | `id`, `filename`, `executed_at` | Unique filename, chronological execution |
| **ApiErrorEnvelope** | Uniform REST API error representation | `success`, `code`, `message`, `details` | Consistent status code mapping |
| **DesignTokenConfig** | Solid-card styling token contracts | `theme_mode`, `surface_card`, `border_contrast`, `text_primary` | High contrast, zero glassmorphism |
