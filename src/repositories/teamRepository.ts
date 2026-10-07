import { query } from '../config/database.js';
import { withTransaction } from '../utils/transaction.js';
import { Team, TeamMember, CreateTeamInput, UpdateTeamInput, TeamFilterOptions } from '../types/team.js';

interface RawTeamRow {
  id: string;
  name: string;
  description: string | null;
  department: string;
  lead_id: string | null;
  lead_name: string | null;
  lead_email: string | null;
  lead_avatar_url: string | null;
  member_count: string | number;
  members_json: TeamMember[] | null;
  created_at: Date;
  updated_at: Date;
}

export class TeamRepository {
  /**
   * Find all teams with optional filtering.
   */
  async findAll(filters: TeamFilterOptions = {}): Promise<Team[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.department) {
      conditions.push(`t.department = $${paramIndex}`);
      params.push(filters.department);
      paramIndex++;
    }

    if (filters.search) {
      conditions.push(`(t.name ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`);
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        t.id,
        t.name,
        t.description,
        t.department,
        t.lead_id,
        l.full_name AS lead_name,
        l.email AS lead_email,
        l.avatar_url AS lead_avatar_url,
        COUNT(DISTINCT et.employee_id) AS member_count,
        COALESCE(
          json_agg(
            json_build_object(
              'id', e.id,
              'name', e.full_name,
              'email', e.email,
              'avatarUrl', e.avatar_url,
              'role', et.role,
              'assignedAt', et.assigned_at
            )
          ) FILTER (WHERE e.id IS NOT NULL),
          '[]'::json
        ) AS members_json,
        t.created_at,
        t.updated_at
      FROM teams t
      LEFT JOIN employees l ON t.lead_id = l.id
      LEFT JOIN employee_teams et ON t.id = et.team_id
      LEFT JOIN employees e ON et.employee_id = e.id
      ${whereClause}
      GROUP BY t.id, l.id
      ORDER BY t.name ASC
    `;

    const res = await query<RawTeamRow>(sql, params);
    return res.rows.map(this.mapRowToTeam);
  }

  /**
   * Find a single team by ID including full roster.
   */
  async findById(id: string): Promise<Team | null> {
    const sql = `
      SELECT 
        t.id,
        t.name,
        t.description,
        t.department,
        t.lead_id,
        l.full_name AS lead_name,
        l.email AS lead_email,
        l.avatar_url AS lead_avatar_url,
        COUNT(DISTINCT et.employee_id) AS member_count,
        COALESCE(
          json_agg(
            json_build_object(
              'id', e.id,
              'name', e.full_name,
              'email', e.email,
              'avatarUrl', e.avatar_url,
              'role', et.role,
              'assignedAt', et.assigned_at
            )
          ) FILTER (WHERE e.id IS NOT NULL),
          '[]'::json
        ) AS members_json,
        t.created_at,
        t.updated_at
      FROM teams t
      LEFT JOIN employees l ON t.lead_id = l.id
      LEFT JOIN employee_teams et ON t.id = et.team_id
      LEFT JOIN employees e ON et.employee_id = e.id
      WHERE t.id = $1
      GROUP BY t.id, l.id
    `;

    const res = await query<RawTeamRow>(sql, [id]);
    const row = res.rows[0];
    if (!row) return null;
    return this.mapRowToTeam(row);
  }

  /**
   * Find a team by exact name (case-insensitive).
   */
  async findByName(name: string): Promise<Team | null> {
    const sql = `
      SELECT 
        t.id,
        t.name,
        t.description,
        t.department,
        t.lead_id,
        l.full_name AS lead_name,
        l.email AS lead_email,
        l.avatar_url AS lead_avatar_url,
        COUNT(DISTINCT et.employee_id) AS member_count,
        '[]'::json AS members_json,
        t.created_at,
        t.updated_at
      FROM teams t
      LEFT JOIN employees l ON t.lead_id = l.id
      LEFT JOIN employee_teams et ON t.id = et.team_id
      WHERE LOWER(t.name) = LOWER($1)
      GROUP BY t.id, l.id
    `;

    const res = await query<RawTeamRow>(sql, [name]);
    const row = res.rows[0];
    if (!row) return null;
    return this.mapRowToTeam(row);
  }

  /**
   * Create a new team profile.
   */
  async create(data: CreateTeamInput): Promise<Team> {
    const sql = `
      INSERT INTO teams (name, description, department, lead_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, description, department, lead_id, created_at, updated_at
    `;
    const params = [
      data.name,
      data.description || null,
      data.department || 'Engineering',
      data.leadId || null
    ];

    const res = await query<RawTeamRow>(sql, params);
    const row = res.rows[0];
    if (!row) {
      throw new Error('Failed to retrieve created team record');
    }
    return this.mapRowToTeam({
      ...row,
      lead_name: null,
      lead_email: null,
      lead_avatar_url: null,
      member_count: 0,
      members_json: []
    });
  }

  /**
   * Update an existing team profile.
   */
  async update(id: string, data: UpdateTeamInput): Promise<Team | null> {
    const fields: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      params.push(data.name);
      paramIndex++;
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      params.push(data.description);
      paramIndex++;
    }

    if (data.department !== undefined) {
      fields.push(`department = $${paramIndex}`);
      params.push(data.department);
      paramIndex++;
    }

    if (data.leadId !== undefined) {
      fields.push(`lead_id = $${paramIndex}`);
      params.push(data.leadId);
      paramIndex++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const sql = `
      UPDATE teams
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id
    `;

    const res = await query(sql, params);
    if (res.rowCount === 0) return null;

    return this.findById(id);
  }

  /**
   * Delete a team transactionally, unlinking members and tasks.
   */
  async delete(id: string): Promise<boolean> {
    return await withTransaction(async (client) => {
      // 1. Unlink members from employee_teams
      await client.query('DELETE FROM employee_teams WHERE team_id = $1', [id]);

      // 2. Delete the team entity
      const res = await client.query('DELETE FROM teams WHERE id = $1', [id]);
      return (res.rowCount ?? 0) > 0;
    });
  }

  /**
   * Add or update an employee member in a team.
   */
  async addMember(teamId: string, employeeId: string, role: string = 'Core Member'): Promise<boolean> {
    const sql = `
      INSERT INTO employee_teams (team_id, employee_id, role, assigned_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (employee_id, team_id) 
      DO UPDATE SET role = EXCLUDED.role, assigned_at = CURRENT_TIMESTAMP
    `;
    const res = await query(sql, [teamId, employeeId, role]);
    return (res.rowCount ?? 0) > 0;
  }

  /**
   * Remove an employee from a team roster.
   */
  async removeMember(teamId: string, employeeId: string): Promise<boolean> {
    const sql = `
      DELETE FROM employee_teams
      WHERE team_id = $1 AND employee_id = $2
    `;
    const res = await query(sql, [teamId, employeeId]);
    return (res.rowCount ?? 0) > 0;
  }

  /**
   * Get all members belonging to a team.
   */
  async getMembers(teamId: string): Promise<TeamMember[]> {
    const sql = `
      SELECT 
        e.id,
        e.full_name AS name,
        e.email,
        e.avatar_url AS "avatarUrl",
        et.role,
        et.assigned_at AS "assignedAt"
      FROM employee_teams et
      JOIN employees e ON et.employee_id = e.id
      WHERE et.team_id = $1
      ORDER BY 
        CASE WHEN et.role = 'Lead' THEN 1 ELSE 2 END,
        e.full_name ASC
    `;
    const res = await query<TeamMember>(sql, [teamId]);
    return res.rows;
  }

  private mapRowToTeam(row: RawTeamRow): Team {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      department: row.department || 'Engineering',
      leadId: row.lead_id,
      lead: row.lead_id && row.lead_name ? {
        id: row.lead_id,
        name: row.lead_name,
        email: row.lead_email || '',
        avatarUrl: row.lead_avatar_url
      } : null,
      memberCount: typeof row.member_count === 'string' ? parseInt(row.member_count, 10) : (row.member_count || 0),
      members: row.members_json || [],
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
    };
  }
}

export const teamRepository = new TeamRepository();
