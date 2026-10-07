# Entity Model: Employee Directory (u01-employee-directory)

## 1. Source of Truth Entity Definitions

```yaml
entities:
  - name: Employee
    description: Master personnel entity representing an individual employee within the organization.
    attributes:
      - name: id
        type: integer
        required: true
        unique: true
        primary_key: true
        description: Unique sequential identifier for the employee.
      - name: full_name
        type: string
        required: true
        unique: false
        min_length: 2
        max_length: 255
        description: Full legal name of the employee.
      - name: position
        type: string
        required: true
        unique: false
        min_length: 2
        max_length: 255
        description: Job title or corporate position.
      - name: age
        type: integer
        required: true
        unique: false
        min_value: 18
        max_value: 120
        description: Employee age in years (must be a positive integer).
      - name: avatar_url
        type: string
        required: false
        unique: false
        max_length: 10485760
        description: Avatar profile image URL or Base64 data URI string.
      - name: created_at
        type: timestamp
        required: true
        default: CURRENT_TIMESTAMP
        description: Record creation timestamp with timezone.
      - name: updated_at
        type: timestamp
        required: true
        default: CURRENT_TIMESTAMP
        description: Last update timestamp with timezone.
    entity_constraints:
      - name: check_positive_age
        rule: "age >= 18 AND age <= 120"
      - name: check_name_not_empty
        rule: "length(trim(full_name)) >= 2"
      - name: check_position_not_empty
        rule: "length(trim(position)) >= 2"
    relationships:
      - entity: EmployeeTeam
        cardinality: one_to_many
        direction: outgoing
        description: An employee can hold multiple team memberships via junction table.

  - name: EmployeeTeam
    description: Association entity establishing Many-to-Many allocation between employees and functional teams.
    attributes:
      - name: id
        type: integer
        required: true
        unique: true
        primary_key: true
        description: Unique identifier for the membership assignment.
      - name: employee_id
        type: integer
        required: true
        references: Employee.id
        on_delete: cascade
        description: Foreign key reference to Employee master record.
      - name: team_id
        type: integer
        required: true
        references: Team.id
        on_delete: cascade
        description: Foreign key reference to Team master record.
      - name: assigned_at
        type: timestamp
        required: true
        default: CURRENT_TIMESTAMP
        description: Timestamp when the employee was assigned to the team.
    entity_constraints:
      - name: unique_employee_team_pair
        rule: "UNIQUE(employee_id, team_id)"
    relationships:
      - entity: Employee
        cardinality: many_to_one
        direction: incoming
        description: Belongs to exactly one Employee.
```

---

## 2. Entity Summary & Architecture Notes

- **Employee**: The core aggregate root for personnel records. Manages identity, demographic details (age, position), and profile avatar imagery. Complies with PDPA standards by isolating personal identifiable information and maintaining explicit audit timestamps.
- **EmployeeTeam**: The junction entity linking `Employee` to `Team` (defined in Unit 02). Enables flexible matrix organization structures where employees can belong to multiple functional units simultaneously without data duplication.

