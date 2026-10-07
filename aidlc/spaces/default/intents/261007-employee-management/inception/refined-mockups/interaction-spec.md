# UI Interaction & Component Specification

## Sources
- Wireframes: `wireframes.md` (rough-mockups)
- User Flows: `user-flow.md` (rough-mockups)
- User Stories: `stories.md` (user-stories)
- Requirements: `requirements.md` (requirements-analysis)
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. Overview & Interaction Architecture

This document specifies the exact behavioral contracts, interactive states, responsive behaviors, and accessibility requirements for all reusable core components in the Employee Management System. All visual components strictly adhere to solid opaque card styling with high-contrast borders and zero glassmorphism blur filters, in full alignment with affirmed team rules.

---

## 2. Component: EmployeeCard

| Field | Value |
|---|---|
| Component | EmployeeCard |
| Description | Opaque card displaying employee photo, name, title, age, and multi-team tags |
| Category | Display / Interactive |

### States

| State | Description | Trigger |
|---|---|---|
| default | Solid surface (`#1e293b` dark / `#ffffff` light), 1px solid border (`#334155` / `#e2e8f0`) | Mount / idle |
| hover | Border shifts to primary accent (`#4f46e5`), subtle scale translation (1.01) | Mouseover |
| focus | 2px solid outline in Royal Indigo with 2px offset | Keyboard Tab focus |
| disabled | Opacity reduced to 0.6, action buttons disabled | Non-editable or archived |
| loading | Displays SkeletonCard with identical dimensions (360x220px) | Async fetch in progress |
| error | Border highlighted in Rose (`#f43f5e`), error badge displayed | Failed data sync |
| empty | Replaced by EmptyState component | No directory records |

### Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| id | string | yes | — | Unique UUID of employee |
| fullName | string | yes | — | Employee first and last name |
| position | string | yes | — | Job title / functional role |
| age | number | yes | — | Employee age (positive integer) |
| avatarUrl | string | no | defaultAvatar | Secure URL or data URI of photo |
| teamMemberships | Array<{id: string, name: string}> | yes | [] | Multi-team associations |
| onEdit | (id: string) => void | yes | — | Callback when Edit clicked |
| onView | (id: string) => void | yes | — | Callback when Details clicked |
| onRemove | (id: string) => void | no | — | Callback when Remove clicked |

### Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| mobile (<768px) | 100% full width stacked cards, avatar 48x48px, compact action buttons |
| tablet (768–1024px) | 2-column grid layout with 16px gutter |
| desktop (>1024px) | 3-column or 4-column responsive grid with 24px gutter |

### Accessibility

| Requirement | Implementation |
|---|---|
| ARIA role | `role="article"` with `aria-labelledby="emp-name-[id]"` |
| Keyboard interaction | `Tab` moves between Edit, View, and Remove buttons; `Enter`/`Space` activates |
| Label / aria-label | Avatar has `alt="Profile picture of Sarah Connor"`; actions have descriptive labels |
| Contrast ratio | Minimum 4.5:1 text-to-card contrast across light and dark modes |
| Screen reader | Announces "Employee card: Sarah Connor, Senior Backend Architect, Teams: Core Engineering, Cloud Infrastructure" |
| Focus management | Retains visible focus indicator with 2px offset; does not lose focus on inline refresh |

---

## 3. Component: EmployeeModal

| Field | Value |
|---|---|
| Component | EmployeeModal |
| Description | Centered dialog for creating and updating employee profiles and team associations |
| Category | Form / Dialog |

### States

| State | Description | Trigger |
|---|---|---|
| closed | Detached from DOM or hidden via `display: none` | Initial state / dismissed |
| open | Centered modal with dimmed background overlay (`rgba(0,0,0,0.6)`) | Add / Edit trigger |
| validating | Real-time inline field validation checking non-empty and positive age | Input blur |
| submitting | Inputs disabled, primary button displays spinner and "Saving..." text | Form submission |
| error | Validation summary banner rendered at top of dialog | Submission validation failed |

### Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| isOpen | boolean | yes | false | Controls modal visibility |
| mode | 'create' \| 'edit' | yes | 'create' | Determines title and button label |
| initialData | EmployeeData \| null | no | null | Pre-populated data for edit mode |
| availableTeams | Array<{id: string, name: string}> | yes | [] | List of teams for multi-select |
| onSave | (data: EmployeeFormData) => Promise<void> | yes | — | Async handler to persist data |
| onClose | () => void | yes | — | Callback to close modal |

### Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| mobile (<768px) | Full-screen modal with fixed header and sticky bottom save action bar |
| tablet (768–1024px) | Centered modal dialog, max-width 560px, scrollable body |
| desktop (>1024px) | Centered modal dialog, max-width 640px, fixed margins |

### Accessibility

| Requirement | Implementation |
|---|---|
| ARIA role | `role="dialog"` with `aria-modal="true"` and `aria-labelledby="emp-modal-title"` |
| Keyboard interaction | `Escape` closes modal; `Tab` key is strictly trapped within modal inputs |
| Label / aria-label | Every input has associated `<label for="...">`; photo upload has `aria-describedby` |
| Contrast ratio | 4.5:1 text contrast for all labels and inputs against `#1e293b` / `#ffffff` background |
| Screen reader | Announces modal opening and current mode ("Add Employee Profile Dialog") |
| Focus management | Focus automatically set to First Name input on open; restored to trigger button on close |

---

## 4. Component: TaskKanbanCard

| Field | Value |
|---|---|
| Component | TaskKanbanCard |
| Description | Draggable and accessible card representing a team task in the 3-stage lifecycle |
| Category | Interactive / Workflow |

### States

| State | Description | Trigger |
|---|---|---|
| default | Opaque solid surface, 1px border, drag handle visible | Mount / idle |
| hover | Elevation shadow increases, cursor changes to `grab` | Mouseover |
| dragging | Card lifted with slight rotation (2deg), opacity 0.85, shadow-lg | Drag start |
| focus | 2px solid Royal Indigo border; keyboard movement actions visible | Keyboard focus |
| moving | Transition animation between columns (200ms ease-out) | Drop or button trigger |

### Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| taskId | string | yes | — | Stable ID (e.g., TASK-101) |
| title | string | yes | — | Task title / description |
| status | 'Todo' \| 'Pending' \| 'Completed' | yes | 'Todo' | Current lifecycle status |
| priority | 'Low' \| 'Medium' \| 'High' | yes | 'Medium' | Task urgency indicator |
| teamName | string | yes | — | Functional team owner |
| assigneeName | string | no | 'Unassigned' | Person responsible |
| onStatusChange | (taskId: string, newStatus: TaskStatus) => void | yes | — | Lifecycle transition handler |

### Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| mobile (<768px) | 100% width in column, drag handles disabled in favor of dedicated move buttons |
| tablet (768–1024px) | Touch drag-and-drop enabled, column width min 280px |
| desktop (>1024px) | Full mouse drag-and-drop + keyboard buttons, column width min 320px |

### Accessibility

| Requirement | Implementation |
|---|---|
| ARIA role | `role="article"` with `aria-roledescription="draggable task"` |
| Keyboard interaction | `Space`/`Enter` opens movement menu; `[Move > Pending]` button accessible directly via Tab |
| Label / aria-label | `aria-label="TASK-101 Implement PostgreSQL Schema, Status: Todo, Priority: High"` |
| Contrast ratio | High contrast status tags (Emerald text on dark green, Amber on dark yellow) |
| Screen reader | Announces: "Moved task TASK-101 to Pending column" on transition |
| Focus management | Focus follows card to destination column after button-triggered transition |

---

## 5. Component: KanbanColumn

| Field | Value |
|---|---|
| Component | KanbanColumn |
| Description | Container representing one of the 3 stages (`Todo`, `Pending`, `Completed`) |
| Category | Layout / Container |

### States

| State | Description | Trigger |
|---|---|---|
| default | Solid surface background, header with stage title and task count pill | Mount |
| drag-over | Border highlights with dashed Indigo accent (`#4f46e5`), subtle background glow | Dragged item over column |
| empty | Displays EmptyState placeholder with "No tasks in this stage" | Task count = 0 |

### Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| stage | 'Todo' \| 'Pending' \| 'Completed' | yes | — | Target lifecycle column |
| taskCount | number | yes | 0 | Count displayed in header badge |
| tasks | Array<TaskData> | yes | [] | List of tasks in this stage |
| onDropTask | (taskId: string, targetStage: TaskStatus) => void | yes | — | Drop event listener |

### Accessibility

| Requirement | Implementation |
|---|---|
| ARIA role | `role="region"` with `aria-label="Todo Stage Column, 8 tasks"` |
| Screen reader | Live region announces when items are added to or removed from the column |

---

## 6. Component: MetricCard

| Field | Value |
|---|---|
| Component | MetricCard |
| Description | Executive KPI summary card displaying key organizational metrics |
| Category | Display / Analytics |

### States

| State | Description | Trigger |
|---|---|---|
| default | Solid opaque card (`#1e293b` / `#ffffff`), large metric numeral, trend badge | Mount |
| hover | Subtle card border highlight, cursor default | Mouseover |
| loading | Displays SkeletonCard with metric numeral placeholder | Data fetching |

### Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| label | string | yes | — | KPI title (e.g., "Total Employees") |
| value | string \| number | yes | — | Primary metric display |
| changeText | string | no | — | Subtitle or comparison metric |
| iconName | string | no | — | Visual icon identifier |
| trend | 'positive' \| 'neutral' \| 'negative' | no | 'neutral' | Visual trend color indicator |

### Accessibility

| Requirement | Implementation |
|---|---|
| ARIA role | `role="region"` with `aria-label="Metric: Total Employees 42"` |
| Contrast ratio | Numerals have >7:1 contrast ratio against card background |

---

## 7. Component: SkeletonLoader & EmptyState

### SkeletonLoader
- **Implementation**: Pure CSS pulsing keyframe animation (`pulse 1.5s ease-in-out infinite`).
- **Accessibility**: Respects `prefers-reduced-motion: reduce` by replacing pulse animation with static low-opacity surface.
- **Contrast**: Low-contrast neutral grey (`#334155` dark / `#e2e8f0` light) to avoid visual flicker.

### EmptyState
- **Implementation**: Centered solid card with non-decorative SVG illustration, descriptive title, explanation paragraph, and primary CTA button.
- **Accessibility**: `role="status"` with polite screen reader announcement.
