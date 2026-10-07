import { query } from '../config/database.js';
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilterOptions,
  TaskStatus
} from '../types/task.js';

interface RawTaskRow {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  team_id: string;
  team_name: string;
  team_department: string;
  assignee_id: string | null;
  assignee_name: string | null;
  assignee_email: string | null;
  assignee_avatar_url: string | null;
  due_date: Date | string | null;
  created_at: Date;
  updated_at: Date;
}

export class TaskRepository {
  /**
   * Find all tasks with flexible filtering.
   */
  async findAll(filters: TaskFilterOptions = {}): Promise<Task[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.teamId) {
      conditions.push(`t.team_id = $${paramIndex}`);
      params.push(filters.teamId);
      paramIndex++;
    }

    if (filters.status) {
      conditions.push(`t.status = $${paramIndex}`);
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.priority) {
      conditions.push(`t.priority = $${paramIndex}`);
      params.push(filters.priority);
      paramIndex++;
    }

    if (filters.assigneeId) {
      conditions.push(`t.assignee_id = $${paramIndex}`);
      params.push(filters.assigneeId);
      paramIndex++;
    }

    if (filters.search) {
      conditions.push(`(t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`);
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.team_id,
        tm.name AS team_name,
        tm.department AS team_department,
        t.assignee_id,
        e.full_name AS assignee_name,
        e.email AS assignee_email,
        e.avatar_url AS assignee_avatar_url,
        t.due_date,
        t.created_at,
        t.updated_at
      FROM tasks t
      INNER JOIN teams tm ON t.team_id = tm.id
      LEFT JOIN employees e ON t.assignee_id = e.id
      ${whereClause}
      ORDER BY 
        CASE t.priority
          WHEN 'Urgent' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
          ELSE 5
        END,
        t.created_at DESC
    `;

    const res = await query<RawTaskRow>(sql, params);
    return res.rows.map(this.mapRowToTask);
  }

  /**
   * Find single task by ID.
   */
  async findById(id: string): Promise<Task | null> {
    const sql = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.team_id,
        tm.name AS team_name,
        tm.department AS team_department,
        t.assignee_id,
        e.full_name AS assignee_name,
        e.email AS assignee_email,
        e.avatar_url AS assignee_avatar_url,
        t.due_date,
        t.created_at,
        t.updated_at
      FROM tasks t
      INNER JOIN teams tm ON t.team_id = tm.id
      LEFT JOIN employees e ON t.assignee_id = e.id
      WHERE t.id = $1
    `;

    const res = await query<RawTaskRow>(sql, [id]);
    const row = res.rows[0];
    if (!row) return null;
    return this.mapRowToTask(row);
  }

  /**
   * Create a new task record.
   */
  async create(data: CreateTaskInput): Promise<Task> {
    const sql = `
      INSERT INTO tasks (title, description, status, priority, team_id, assignee_id, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    const params = [
      data.title,
      data.description || null,
      data.status || 'Todo',
      data.priority || 'Medium',
      data.teamId,
      data.assigneeId || null,
      data.dueDate || null
    ];

    const res = await query<{ id: string }>(sql, params);
    const row = res.rows[0];
    if (!row) throw new Error('Failed to create task');

    const created = await this.findById(row.id);
    if (!created) throw new Error('Failed to retrieve created task');
    return created;
  }

  /**
   * Update task fields.
   */
  async update(id: string, data: UpdateTaskInput): Promise<Task | null> {
    const fields: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex}`);
      params.push(data.title);
      paramIndex++;
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      params.push(data.description);
      paramIndex++;
    }

    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      params.push(data.status);
      paramIndex++;
    }

    if (data.priority !== undefined) {
      fields.push(`priority = $${paramIndex}`);
      params.push(data.priority);
      paramIndex++;
    }

    if (data.teamId !== undefined) {
      fields.push(`team_id = $${paramIndex}`);
      params.push(data.teamId);
      paramIndex++;
    }

    if (data.assigneeId !== undefined) {
      fields.push(`assignee_id = $${paramIndex}`);
      params.push(data.assigneeId);
      paramIndex++;
    }

    if (data.dueDate !== undefined) {
      fields.push(`due_date = $${paramIndex}`);
      params.push(data.dueDate);
      paramIndex++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const sql = `
      UPDATE tasks
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id
    `;

    const res = await query(sql, params);
    if (res.rowCount === 0) return null;

    return this.findById(id);
  }

  /**
   * Delete task by ID.
   */
  async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM tasks WHERE id = $1';
    const res = await query(sql, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  private mapRowToTask(row: RawTaskRow): Task {
    let formattedDueDate: string | null = null;
    if (row.due_date) {
      if (typeof row.due_date === 'string') {
        formattedDueDate = row.due_date.slice(0, 10);
      } else if (row.due_date instanceof Date) {
        formattedDueDate = row.due_date.toISOString().slice(0, 10);
      }
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      teamId: row.team_id,
      teamName: row.team_name,
      team: {
        id: row.team_id,
        name: row.team_name,
        department: row.team_department
      },
      assigneeId: row.assignee_id,
      assigneeName: row.assignee_name,
      assigneeAvatarUrl: row.assignee_avatar_url,
      assignee: row.assignee_id && row.assignee_name ? {
        id: row.assignee_id,
        name: row.assignee_name,
        email: row.assignee_email || '',
        avatarUrl: row.assignee_avatar_url
      } : null,
      dueDate: formattedDueDate,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
    };
  }
}

export const taskRepository = new TaskRepository();
