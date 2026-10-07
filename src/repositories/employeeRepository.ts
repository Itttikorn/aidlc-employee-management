import { PoolClient } from 'pg';
import { pool } from '../config/database.js';
import { withTransaction } from '../utils/transaction.js';
import {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeFilterOptions,
  PaginatedEmployeesResult,
  TeamSummary
} from '../types/employee.js';
import { calculateAge } from '../validators/employeeValidator.js';

export class EmployeeRepository {
  /**
   * Find paginated employees with substring search on name/position and team filtering.
   */
  async findAll(options: EmployeeFilterOptions = {}): Promise<PaginatedEmployeesResult> {
    const {
      search,
      teamId,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    let joins = '';

    if (search && search.trim() !== '') {
      const searchPattern = `%${search.trim()}%`;
      conditions.push(`(e.name ILIKE $${paramIndex} OR e.full_name ILIKE $${paramIndex} OR e.role ILIKE $${paramIndex} OR e.position ILIKE $${paramIndex} OR e.email ILIKE $${paramIndex})`);
      values.push(searchPattern);
      paramIndex++;
    }

    if (teamId) {
      joins += ` INNER JOIN employee_teams et_filter ON e.id = et_filter.employee_id AND et_filter.team_id = $${paramIndex}`;
      values.push(teamId);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 1. Total count query
    const countSql = `
      SELECT COUNT(DISTINCT e.id) as total
      FROM employees e
      ${joins}
      ${whereClause}
    `;
    const countRes = await pool.query(countSql, values);
    const total = parseInt(countRes.rows[0]?.total || '0', 10);

    // 2. Data query with aggregated teams
    const sortColumnMap: Record<string, string> = {
      name: 'e.name',
      email: 'e.email',
      role: 'e.role',
      createdAt: 'e.created_at'
    };
    const orderColumn = sortColumnMap[sortBy] || 'e.created_at';
    const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const dataSql = `
      SELECT 
        e.id,
        COALESCE(e.name, e.full_name) as name,
        COALESCE(e.full_name, e.name) as full_name,
        e.email,
        COALESCE(e.role, e.position) as role,
        COALESCE(e.position, e.role) as position,
        e.birthdate,
        e.avatar_url,
        e.created_at,
        e.updated_at,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name, 'description', t.description)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as teams
      FROM employees e
      ${joins}
      LEFT JOIN employee_teams et ON e.id = et.employee_id
      LEFT JOIN teams t ON et.team_id = t.id
      ${whereClause}
      GROUP BY e.id
      ORDER BY ${orderColumn} ${orderDirection}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);
    const dataRes = await pool.query(dataSql, values);

    const employees: Employee[] = dataRes.rows.map((row) => this.mapRowToEmployee(row));

    return {
      data: employees,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }

  /**
   * Find a single employee by UUID.
   */
  async findById(id: string, client?: PoolClient): Promise<Employee | null> {
    const db = client || pool;
    const sql = `
      SELECT 
        e.id,
        COALESCE(e.name, e.full_name) as name,
        COALESCE(e.full_name, e.name) as full_name,
        e.email,
        COALESCE(e.role, e.position) as role,
        COALESCE(e.position, e.role) as position,
        e.birthdate,
        e.avatar_url,
        e.created_at,
        e.updated_at,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name, 'description', t.description)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as teams
      FROM employees e
      LEFT JOIN employee_teams et ON e.id = et.employee_id
      LEFT JOIN teams t ON et.team_id = t.id
      WHERE e.id = $1
      GROUP BY e.id
    `;
    const res = await db.query(sql, [id]);
    if (res.rows.length === 0) return null;
    return this.mapRowToEmployee(res.rows[0]);
  }

  /**
   * Find employee by unique email.
   */
  async findByEmail(email: string, client?: PoolClient): Promise<Employee | null> {
    const db = client || pool;
    const sql = `
      SELECT id, name, full_name, email, role, position, birthdate, avatar_url, created_at, updated_at
      FROM employees
      WHERE email = $1
    `;
    const res = await db.query(sql, [email]);
    if (res.rows.length === 0) return null;
    return this.mapRowToEmployee(res.rows[0]);
  }

  /**
   * Create an employee with transactional team associations.
   */
  async create(data: CreateEmployeeInput): Promise<Employee> {
    return withTransaction(async (client) => {
      const name = data.name || data.fullName || '';
      const role = data.role || data.position || '';
      const birthDate = data.birthDate ? new Date(data.birthDate) : null;
      const avatarUrl = data.avatarUrl !== undefined ? data.avatarUrl : null;

      const insertSql = `
        INSERT INTO employees (name, full_name, email, role, position, birthdate, avatar_url)
        VALUES ($1, $1, $2, $3, $3, $4, $5)
        RETURNING id, name, full_name, email, role, position, birthdate, avatar_url, created_at, updated_at
      `;

      const res = await client.query(insertSql, [name, data.email, role, birthDate, avatarUrl]);
      const employeeId = res.rows[0].id;

      if (data.teamIds && data.teamIds.length > 0) {
        for (const teamId of data.teamIds) {
          await client.query(
            `INSERT INTO employee_teams (employee_id, team_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [employeeId, teamId]
          );
        }
      }

      const fullRecord = await this.findById(employeeId, client);
      if (!fullRecord) {
        throw new Error('Failed to retrieve newly created employee');
      }
      return fullRecord;
    });
  }

  /**
   * Update an employee's profile and optionally overwrite team associations.
   */
  async update(id: string, data: UpdateEmployeeInput): Promise<Employee | null> {
    return withTransaction(async (client) => {
      const existing = await this.findById(id, client);
      if (!existing) return null;

      const name = data.name ?? data.fullName ?? existing.name;
      const email = data.email ?? existing.email;
      const role = data.role ?? data.position ?? existing.role;
      const birthDate = data.birthDate !== undefined ? (data.birthDate ? new Date(data.birthDate) : null) : (existing.birthDate ? new Date(existing.birthDate) : null);
      const avatarUrl = data.avatarUrl !== undefined ? data.avatarUrl : existing.avatarUrl;

      const updateSql = `
        UPDATE employees
        SET name = $1, full_name = $1, email = $2, role = $3, position = $3, birthdate = $4, avatar_url = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING id
      `;

      await client.query(updateSql, [name, email, role, birthDate, avatarUrl, id]);

      if (data.teamIds !== undefined) {
        // Replace existing team associations
        await client.query(`DELETE FROM employee_teams WHERE employee_id = $1`, [id]);
        for (const teamId of data.teamIds) {
          await client.query(
            `INSERT INTO employee_teams (employee_id, team_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [id, teamId]
          );
        }
      }

      return this.findById(id, client);
    });
  }

  /**
   * Delete an employee (cascading team junction rows).
   */
  async delete(id: string): Promise<boolean> {
    return withTransaction(async (client) => {
      await client.query(`DELETE FROM employee_teams WHERE employee_id = $1`, [id]);
      const res = await client.query(`DELETE FROM employees WHERE id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    });
  }

  private mapRowToEmployee(row: any): Employee {
    let teams: TeamSummary[] = [];
    if (Array.isArray(row.teams)) {
      teams = row.teams;
    } else if (typeof row.teams === 'string') {
      try {
        teams = JSON.parse(row.teams);
      } catch {
        teams = [];
      }
    }

    let birthDateStr: string | null = null;
    let computedAge: number | null = null;
    if (row.birthdate) {
      const d = new Date(row.birthdate);
      if (!isNaN(d.getTime())) {
        birthDateStr = d.toISOString().split('T')[0] ?? null;
        computedAge = calculateAge(d);
      }
    }

    return {
      id: row.id,
      name: row.name || row.full_name,
      fullName: row.full_name || row.name,
      email: row.email,
      role: row.role || row.position,
      position: row.position || row.role,
      birthDate: birthDateStr,
      age: computedAge,
      avatarUrl: row.avatar_url,
      teams,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export const employeeRepository = new EmployeeRepository();
