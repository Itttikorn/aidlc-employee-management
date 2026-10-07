# Low-Fidelity Wireframes & Screen Architecture

## Information Architecture & Layout Structure

The application adopts a responsive two-column layout consisting of a persistent left navigation sidebar and a dynamic main content viewport [desc] [Q1].

```
+--------------------------------------------------------------------------------------------------+
| APP HEADER: [Logo / Company Name]                      [Search Bar]       [Theme Toggle] [Admin] |
+------------------+-------------------------------------------------------------------------------+
| SIDEBAR NAV      | MAIN CONTENT VIEWPORT                                                         |
|                  |                                                                               |
| [>] Dashboard    |                                                                               |
| [ ] Employees    |  (Dynamic View: Dashboard / Employees / Teams / Tasks)                        |
| [ ] Teams        |                                                                               |
| [ ] Tasks        |                                                                               |
|                  |                                                                               |
|                  |                                                                               |
+------------------+-------------------------------------------------------------------------------+
```

---

## Screen 1: Executive Dashboard View (`/dashboard`)

*Accessibility note: `<h1>Company Dashboard</h1>`, Landmark regions: `<nav>` (Sidebar), `<main>` (Dashboard), `<header>` (App Bar); Keyboard entry point: Metric cards focusable [Q4].*

```
+--------------------------------------------------------------------------------------------------+
| DASHBOARD                                                                                        |
+--------------------------------------------------------------------------------------------------+
| SUMMARY METRICS (Solid Cards)                                                                    |
| +--------------------+ +--------------------+ +--------------------+ +--------------------------+ |
| | TOTAL EMPLOYEES    | | ACTIVE TEAMS       | | TOTAL TASKS        | | COMPLETION RATE          | |
| | 42                 | | 6                  | | 85                 | | 68%                      | |
| +--------------------+ +--------------------+ +--------------------+ +--------------------------+ |
|                                                                                                  |
| +--------------------------------------------------+ +-----------------------------------------+ |
| | TASK DISTRIBUTION BY STAGE                       | | TEAM WORKLOAD & TASK SUMMARY            | |
| | [ Todo: 24 ] [ Pending: 18 ] [ Completed: 43 ]   | | Engineering:  32 tasks (12 members)     | |
| |                                                  | | Marketing:    18 tasks (6 members)      | |
| | [======== Todo 28% =======|==== Pend 21% ===|==] | | Product:      14 tasks (5 members)      | |
| |                                                  | | Operations:   21 tasks (8 members)      | |
| +--------------------------------------------------+ +-----------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
```

---

## Screen 2: Employee Directory View (`/employees`)

*Accessibility note: `<h1>Employee Directory</h1>`, Landmark regions: `<nav>` (Sidebar), `<main>` (Directory), `<section>` (Card Grid / Table); Keyboard entry point: Search input & Add Employee button [Q2].*

```
+--------------------------------------------------------------------------------------------------+
| EMPLOYEES                                                 [+ Add Employee] [ Grid | Table ]    |
| [ Search by name, title... ]   [ Filter by Team: All v ]   [ Sort by: Name v ]                   |
+--------------------------------------------------------------------------------------------------+
| CARD GRID VIEW (Solid UI Cards)                                                                  |
|                                                                                                  |
| +-------------------------------+  +-------------------------------+                             |
| | [ Avatar ]  Sarah Connor      |  | [ Avatar ]  James Holden      |                             |
| |             Senior Engineer   |  |             Product Manager   |                             |
| | Age: 34                       |  | Age: 29                       |                             |
| | Teams: [ Engineering ] [ Ops ]|  | Teams: [ Product ]            |                             |
| | [View Details] [Edit]         |  | [View Details] [Edit]         |                             |
| +-------------------------------+  +-------------------------------+                             |
|                                                                                                  |
| +-------------------------------+  +-------------------------------+                             |
| | [ Avatar ]  Alex Kamal        |  | [ Avatar ]  Naomi Nagata      |                             |
| |             DevOps Specialist |  |             Lead Architect    |                             |
| | Age: 38                       |  | Age: 32                       |                             |
| | Teams: [ Ops ] [ Platform ]   |  | Teams: [ Engineering ]        |                             |
| | [View Details] [Edit]         |  | [View Details] [Edit]         |                             |
| +-------------------------------+  +-------------------------------+                             |
+--------------------------------------------------------------------------------------------------+
```

---

## Screen 3: Teams Management View (`/teams`)

*Accessibility note: `<h1>Teams Management</h1>`, Landmark regions: `<nav>` (Sidebar), `<main>` (Teams list), `<dialog>` (Team Modal); Keyboard entry point: Add Team button [desc] [Q1].*

```
+--------------------------------------------------------------------------------------------------+
| TEAMS                                                                          [+ Create Team]   |
+--------------------------------------------------------------------------------------------------+
| +----------------------------------------------------------------------------------------------+ |
| | TEAM: Core Engineering (12 Members)                                   [Edit Team] [Manage]   |
| | Description: Responsible for core architecture, backend services, and PostgreSQL databases  |
| | Team Tasks: 32 total (8 Todo | 6 Pending | 18 Completed)                                     |
| | Members: [Photo] [Photo] [Photo] [Photo] +8 more...                                          |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| +----------------------------------------------------------------------------------------------+ |
| | TEAM: Product Design & Strategy (5 Members)                           [Edit Team] [Manage]   |
| | Description: UI/UX design systems, user journey mapping, and feature specifications          |
| | Team Tasks: 14 total (4 Todo | 3 Pending | 7 Completed)                                      |
| | Members: [Photo] [Photo] [Photo] +2 more...                                                  |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
```

---

## Screen 4: Team Task Board View (`/tasks`)

*Accessibility note: `<h1>Team Task Board</h1>`, Landmark regions: `<nav>` (Sidebar), `<main>` (Kanban Board), `<section>` (3 Columns); Keyboard entry point: Column task cards & New Task modal [Q3].*

```
+--------------------------------------------------------------------------------------------------+
| TASK BOARD                               [ Filter Team: Engineering v ]        [+ Create Task]   |
+--------------------------------------------------------------------------------------------------+
| TODO (8)                         | PENDING (6)                      | COMPLETED (18)             |
|----------------------------------+----------------------------------+----------------------------|
| +------------------------------+ | +------------------------------+ | +------------------------+ |
| | TASK-101                     | | | TASK-098                     | | | TASK-085               | |
| | Implement PostgreSQL schema  | | | Code review team assignment  | | | Initialize repository  | |
| | Team: Engineering            | | | Team: Engineering            | | | Team: Engineering      | |
| | [ Move > Pending ]           | | | [ < Todo ] [ Move > Done ]   | | | [ Move > Pending ]     | |
| +------------------------------+ | +------------------------------+ | +------------------------+ |
|                                  |                                  |                            |
| +------------------------------+ | +------------------------------+ | +------------------------+ |
| | TASK-104                     | | | TASK-099                     | | | TASK-089               | |
| | Add employee avatar upload   | | | Validate PDPA compliance     | | | Setup SPA navigation   | |
| | Team: Engineering            | | | Team: Product / Ops          | | | Team: Engineering      | |
| | [ Move > Pending ]           | | | [ < Todo ] [ Move > Done ]   | | | [ Move > Pending ]     | |
| +------------------------------+ | +------------------------------+ | +------------------------+ |
+--------------------------------------------------------------------------------------------------+
```

## Design System & Theme Directives

- **Color Palette & Contrast**: Deep slate / charcoal dark mode and crisp pearl / clean white light mode with vibrant royal blue primary accents and amber/green state indicators [Q5].
- **Card Aesthetics**: Crisp, opaque solid borders and surfaces (**strictly avoiding glassmorphism blur/translucency**) [Q5].
- **Micro-Interactions**: Smooth state hover feedback, snappy column movements, and responsive dialog transitions [Q5].

## Assumptions & Open Questions

None.
