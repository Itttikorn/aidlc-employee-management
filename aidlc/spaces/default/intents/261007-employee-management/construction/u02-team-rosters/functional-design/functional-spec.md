# Functional Specification — Unit 02 (Team Rosters & Multi-Team Allocations)

## Overview & Scope
Unit 02 (`u02-team-rosters`) provides full-stack team management capabilities: creating and maintaining teams, assigning and removing employee memberships with role designations (`Lead`, `Core Member`, `Contributor`), filtering teams by department, and viewing member avatar rosters.

## REST API Contracts

### 1. `GET /api/teams`
- **Query Parameters**:
  - `department` (optional string): Filter teams by department.
  - `search` (optional string): Substring search across team name and description.
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "name": "Frontend Engineering",
        "description": "Building modern client experiences",
        "department": "Engineering",
        "lead": {
          "id": "uuid",
          "name": "Marcus Vance",
          "email": "marcus@company.com",
          "avatarUrl": null
        },
        "memberCount": 5,
        "members": [
          {
            "id": "uuid",
            "name": "Sarah Connor",
            "email": "sarah@company.com",
            "role": "Lead",
            "avatarUrl": null
          }
        ],
        "createdAt": "2026-10-07T08:00:00Z",
        "updatedAt": "2026-10-07T08:00:00Z"
      }
    ]
  }
  ```

### 2. `GET /api/teams/:id`
- **Response**: `200 OK` with full team details and complete member list, or `404 Not Found`.

### 3. `POST /api/teams`
- **Request Body**:
  ```json
  {
    "name": "Core Infrastructure",
    "description": "Cloud hosting, CI/CD, and database systems",
    "department": "Engineering",
    "leadId": "optional-employee-uuid"
  }
  ```
- **Response**: `201 Created` with created team entity.

### 4. `PUT /api/teams/:id`
- **Request Body**: Partial or full update payload (`name`, `description`, `department`, `leadId`).
- **Response**: `200 OK` or `404 Not Found` / `409 Conflict`.

### 5. `DELETE /api/teams/:id`
- **Behavior**: Transactionally removes all member assignments and deletes the team.
- **Response**: `200 OK` (`{ "success": true, "message": "Team deleted successfully" }`).

### 6. `POST /api/teams/:id/members`
- **Request Body**:
  ```json
  {
    "employeeId": "uuid",
    "role": "Core Member"
  }
  ```
- **Response**: `200 OK` or `201 Created` with updated membership.

### 7. `DELETE /api/teams/:id/members/:employeeId`
- **Behavior**: Removes employee from the team roster.
- **Response**: `200 OK`.

## User Interface Specification (Team Hub)
- **Top Navigation Tab**: "Teams" navigation alongside "Employees" directory.
- **Team Grid View**: Solid cards displaying team name, department badge, description, team lead info, member avatar stack (+ count), and Action buttons (Add Member, Edit, Delete).
- **Manage Members Modal**: Select from existing employee directory to add to team, with role selector and quick remove button for existing members.
