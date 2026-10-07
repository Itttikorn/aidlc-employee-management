# High-Fidelity Refined Mockups & Screen Architecture

## Sources
- Wireframes: `wireframes.md` (rough-mockups)
- User Flows: `user-flow.md` (rough-mockups)
- User Stories: `stories.md` (user-stories)
- Requirements: `requirements.md` (requirements-analysis)
- Team Practices: `team-practices.md` (practices-discovery)

---

## 1. Global Shell & Navigation Framework

The application shell implements a responsive two-column architecture with a persistent side navigation panel (collapsible on tablet, bottom-tab on mobile) and a high-contrast main content viewport. In accordance with affirmed team guardrails, all surfaces utilize **solid opaque styling with crisp high-contrast borders and zero glassmorphism**.

```
+-------------------------------------------------------------------------------------------------------------------------+
| APP BAR: [Acme Corp Logo] Employee Management System            [ Search All Records... ]    [Dark/Light] [Admin Profile] |
+---------------------+---------------------------------------------------------------------------------------------------+
| NAVIGATION          | MAIN VIEWPORT (Deep Slate #0f172a in Dark Mode / Crisp Pearl #f8fafc in Light Mode)              |
|                     |                                                                                                   |
| [*] Dashboard       | Active View Render Container                                                                      |
| [ ] Employees       | (Solid Opaque Cards, 1px border #334155 / #e2e8f0, zero backdrop-blur filters)                   |
| [ ] Teams           |                                                                                                   |
| [ ] Tasks           |                                                                                                   |
|                     |                                                                                                   |
| ------------------- |                                                                                                   |
| System: PostgreSQL  |                                                                                                   |
| Status: Online      |                                                                                                   |
+---------------------+---------------------------------------------------------------------------------------------------+
```

---

## 2. Screen 1: Executive Analytics Dashboard (`/dashboard`)

Addresses stories **US4.1** (KPI Cards) and **US4.2** (Task Distribution & Team Workload).

```
+-------------------------------------------------------------------------------------------------------------------------+
| DASHBOARD OVERVIEW                                                                             [ Export PDF ] [ Refresh ]|
+-------------------------------------------------------------------------------------------------------------------------+
| KEY PERFORMANCE INDICATORS (Solid Opaque Cards #1e293b / #ffffff)                                                      |
| +-------------------------+ +-------------------------+ +-------------------------+ +---------------------------------+ |
| | TOTAL EMPLOYEES         | | ACTIVE FUNCTIONAL TEAMS | | TOTAL TASKS IN FLIGHT   | | GLOBAL COMPLETION RATE          | |
| | 42                      | | 6                       | | 85                      | | 68.2%                           | |
| | +3 new this month       | | 100% capacity assigned  | | 24 Todo | 18 Pending    | | [====================>       ]  | |
| +-------------------------+ +-------------------------+ +-------------------------+ +---------------------------------+ |
|                                                                                                                         |
| +---------------------------------------------------------+ +---------------------------------------------------------+ |
| | TASK DISTRIBUTION BY LIFECYCLE STAGE                    | | TEAM WORKLOAD & CAPACITY MATRIX                         | |
| |                                                         | |                                                         | |
| | [ Todo: 24 (28%) ]   [ Pending: 18 (21%) ] [ Done: 43 ] | | Engineering:  32 Tasks | 12 Members  [ High Load ]     | |
| |                                                         | | Operations:   21 Tasks |  8 Members  [ Balanced ]      | |
| | [==== Todo 28% ===|=== Pending 21% ===|=== Done 51% ===]| | Product:      18 Tasks |  5 Members  [ Balanced ]      | |
| |                                                         | | Marketing:    14 Tasks |  6 Members  [ Optimal ]       | |
| | Legend:                                                 | |                                                         | |
| | [=] Slate #64748b Todo   [=] Amber #f59e0b Pending     | | Actions: [ View Full Workload Breakdown > ]             | |
| | [=] Emerald #10b981 Completed                           | |                                                         | |
| +---------------------------------------------------------+ +---------------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 3. Screen 2: Employee Directory & Search Grid (`/employees`)

Addresses stories **US1.1** (Create/Edit Profile), **US1.2** (Search & Filter), and **US2.1** (Multi-Team Tagging).

```
+-------------------------------------------------------------------------------------------------------------------------+
| EMPLOYEE DIRECTORY                                                 [ Search Bar ] [ Filter: All Teams v ] [+ Add Employee]|
+-------------------------------------------------------------------------------------------------------------------------+
| SOLID CARD DIRECTORY GRID (Multi-Column Responsive)                                                                     |
|                                                                                                                         |
| +---------------------------------------------------+   +---------------------------------------------------+           |
| | [Photo: Sarah C.]  Sarah Connor                    |   | [Photo: James H.]  James Holden                   |           |
| |                    Senior Backend Architect       |   |                    Product Manager                |           |
| | Age: 34            Status: Active                 |   | Age: 29            Status: Active                 |           |
| |                                                   |   |                                                   |           |
| | Team Memberships (Multi-Team Tagged):             |   | Team Memberships (Multi-Team Tagged):             |           |
| | [ Core Engineering ] [ Cloud Infrastructure ]     |   | [ Product Strategy ] [ Operations ]               |           |
| |                                                   |   |                                                   |           |
| | [ Edit Profile ]  [ View Details ]  [ Remove ]    |   | [ Edit Profile ]  [ View Details ]  [ Remove ]    |           |
| +---------------------------------------------------+   +---------------------------------------------------+           |
|                                                                                                                         |
| +---------------------------------------------------+   +---------------------------------------------------+           |
| | [Photo: Alex K.]   Alex Kamal                     |   | [Photo: Naomi N.]  Naomi Nagata                   |           |
| |                    DevOps Engineer                |   |                    Lead Systems Architect         |           |
| | Age: 38            Status: Active                 |   | Age: 32            Status: Active                 |           |
| |                                                   |   |                                                   |           |
| | Team Memberships:                                 |   | Team Memberships:                                 |           |
| | [ Cloud Infrastructure ] [ Core Engineering ]     |   | [ Core Engineering ]                              |           |
| |                                                   |   |                                                   |           |
| | [ Edit Profile ]  [ View Details ]  [ Remove ]    |   | [ Edit Profile ]  [ View Details ]  [ Remove ]    |           |
| +---------------------------------------------------+   +---------------------------------------------------+           |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 4. Screen 3: Add / Edit Employee Modal Dialog

Addresses stories **US1.1** and **US2.1**, adhering to the confirmed **Option A** centered modal dialog pattern.

```
+----------------------------------------------------------------------------------+
| MODAL OVERLAY (Darkened backdrop, focus-trapped, Esc to dismiss)                |
|  +----------------------------------------------------------------------------+  |
|  | ADD / EDIT EMPLOYEE PROFILE                                            [X] |  |
|  +----------------------------------------------------------------------------+  |
|  | FULL NAME *                                                                |  |
|  | [ Sarah Connor                                                           ] |  |
|  |                                                                            |  |
|  | POSITION / TITLE *                                                         |  |
|  | [ Senior Backend Architect                                               ] |  |
|  |                                                                            |  |
|  | AGE (Positive Integer) *                                                    |  |
|  | [ 34                                                                     ] |  |
|  |                                                                            |  |
|  | PROFILE AVATAR PHOTO (PNG/JPG, max 2MB) *                                  |  |
|  | [ Current Photo Preview: 80x80 ]   [ Browse Image File... ] [ Delete ]     |  |
|  | (PDPA Notice: Employee photo used exclusively for internal directory)      |  |
|  |                                                                            |  |
|  | FUNCTIONAL TEAM ASSIGNMENTS (Multi-Select Tag Dropdown) *                   |  |
|  | [ x Core Engineering ] [ x Cloud Infrastructure ]  [ Select Teams... v ]  |  |
|  |                                                                            |  |
|  | -------------------------------------------------------------------------- |  |
|  | [ Cancel ]                                         [ Save Employee Record ]|  |
|  +----------------------------------------------------------------------------+  |
+----------------------------------------------------------------------------------+
```

---

## 5. Screen 4: Teams Management & Rosters (`/teams`)

Addresses stories **US2.1** and **US2.2** (Team Roster & Details).

```
+-------------------------------------------------------------------------------------------------------------------------+
| TEAMS DIRECTORY & ALLOCATIONS                                                                        [+ Create New Team]|
+-------------------------------------------------------------------------------------------------------------------------+
| +---------------------------------------------------------------------------------------------------------------------+ |
| | TEAM: Core Engineering                                                          [ Edit Team ] [ Manage Allocations ]| |
| | Lead: Naomi Nagata | Active Members: 12 | Total Assigned Tasks: 32                                                  | |
| | Description: Core distributed systems, PostgreSQL data layer, and high-performance REST APIs.                       | |
| |                                                                                                                     | |
| | Active Task Breakdown:                                                                                              | |
| | [ Todo: 8 ]   [ Pending: 6 ]   [ Completed: 18 ]   (Completion: 56.3%)                                              | |
| |                                                                                                                     | |
| | Member Roster Avatars:                                                                                              | |
| | (Avatar: SC) (Avatar: NN) (Avatar: AK) (Avatar: JH) (Avatar: AM) +7 more members...                                  | |
| +---------------------------------------------------------------------------------------------------------------------+ |
|                                                                                                                         |
| +---------------------------------------------------------------------------------------------------------------------+ |
| | TEAM: Product & Design Strategy                                                 [ Edit Team ] [ Manage Allocations ]| |
| | Lead: James Holden | Active Members: 5 | Total Assigned Tasks: 18                                                   | |
| | Description: UI design systems, solid card components, accessibility standards, and product roadmaps.                | |
| |                                                                                                                     | |
| | Active Task Breakdown:                                                                                              | |
| | [ Todo: 4 ]   [ Pending: 3 ]   [ Completed: 11 ]   (Completion: 61.1%)                                              | |
| |                                                                                                                     | |
| | Member Roster Avatars:                                                                                              | |
| | (Avatar: JH) (Avatar: DW) (Avatar: BL) +2 more members...                                                           | |
| +---------------------------------------------------------------------------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 6. Screen 5: 3-Stage Kanban Task Board (`/tasks`)

Addresses stories **US3.1** (Author Task), **US3.2** (3-Stage Transitions), and **US5.2** (Solid Card Styling). Implements drag-and-drop + accessible button fallbacks.

```
+-------------------------------------------------------------------------------------------------------------------------+
| TEAM TASK BOARD                            [ Filter by Team: Core Engineering v ] [ Search Tasks... ]  [+ Author Task]  |
+-------------------------------------------------------------------------------------------------------------------------+
| STAGE 1: TODO (8)                  | STAGE 2: PENDING (6)               | STAGE 3: COMPLETED (18)                       |
|------------------------------------+------------------------------------+-----------------------------------------------|
| +--------------------------------+ | +--------------------------------+ | +-------------------------------------------+ |
| | [::] TASK-101 (High)           | | | [::] TASK-098 (Medium)         | | | [::] TASK-085 (High)                      | |
| | Implement PostgreSQL Schema    | | | Code Review Multi-Team Joined  | | | Repository Scaffold & Tooling Setup       | |
| | Team: Core Engineering         | | | Team: Core Engineering         | | | Team: Core Engineering                    | |
| | Assigned: Sarah Connor         | | | Assigned: Alex Kamal           | | | Assigned: Naomi Nagata                    | |
| | Due: Tomorrow                  | | | Due: Today                     | | | Completed: Yesterday                      | |
| |                                | | |                                | | |                                           | |
| | [ Move > Pending ]             | | | [ < Todo ]  [ Move > Done ]    | | | [ < Reopen to Pending ]                   | |
| +--------------------------------+ | +--------------------------------+ | +-------------------------------------------+ |
|                                    |                                    |                                               |
| +--------------------------------+ | +--------------------------------+ | +-------------------------------------------+ |
| | [::] TASK-105 (Medium)         | | | [::] TASK-094 (Low)            | | | [::] TASK-088 (High)                      | |
| | Employee Avatar PDPA Validator | | | Polish Solid UI Card Styling   | | | Configure Vitest Automation Pipeline      | |
| | Team: Core Engineering         | | | Team: Product & Design         | | | Team: Core Engineering                    | |
| | Assigned: Naomi Nagata         | | | Assigned: James Holden         | | | Assigned: Sarah Connor                    | |
| |                                | | |                                | | |                                           | |
| | [ Move > Pending ]             | | | [ < Todo ]  [ Move > Done ]    | | | [ < Reopen to Pending ]                   | |
| +--------------------------------+ | +--------------------------------+ | +-------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 7. Screen 6: Screen States (Loading Skeletons & Empty States)

Addresses confirmed **Option A** for loading and empty state feedback across views.

### Loading State (Animated Pulsing Skeletons)
```
+-------------------------------------------------------------------------------------------------------------------------+
| [ SKELETON RECT 200x32 ]                                                      [ SKELETON RECT ] [ SKELETON RECT ]       |
+-------------------------------------------------------------------------------------------------------------------------+
| +---------------------------------------------------+   +---------------------------------------------------+           |
| | ( Skeleton Avatar 56x56 )  [ Skeleton Text 180 ]   |   | ( Skeleton Avatar 56x56 )  [ Skeleton Text 180 ]   |           |
| |                            [ Skeleton Text 120 ]   |   |                            [ Skeleton Text 120 ]   |           |
| | [ Skeleton Tag 80 ] [ Skeleton Tag 90 ]           |   | [ Skeleton Tag 80 ] [ Skeleton Tag 90 ]           |           |
| | [ Skeleton Button 100 ]                           |   | [ Skeleton Button 100 ]                           |           |
| +---------------------------------------------------+   +---------------------------------------------------+           |
+-------------------------------------------------------------------------------------------------------------------------+
```

### Empty State (Illustration + Actionable Call-To-Action)
```
+-------------------------------------------------------------------------------------------------------------------------+
|                                                                                                                         |
|                                       +-----------------------------------+                                             |
|                                       |           [ ICON: FOLDER ]        |                                             |
|                                       |        No Employees Found         |                                             |
|                                       | There are no employee records matching |                                        |
|                                       | your active filter criteria.      |                                             |
|                                       |                                   |                                             |
|                                       |        [ + Add First Employee ]   |                                             |
|                                       +-----------------------------------+                                             |
|                                                                                                                         |
+-------------------------------------------------------------------------------------------------------------------------+
```
