import { employeeRepository, EmployeeRepository } from '../repositories/employeeRepository.js';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeQuerySchema
} from '../validators/employeeValidator.js';
import {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeFilterOptions,
  PaginatedEmployeesResult
} from '../types/employee.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class EmployeeService {
  constructor(private readonly repo: EmployeeRepository = employeeRepository) {}

  /**
   * Retrieve paginated and filtered employees list.
   */
  async getEmployees(filter: EmployeeFilterOptions = {}): Promise<PaginatedEmployeesResult> {
    const validatedFilter = employeeQuerySchema.parse(filter);
    return this.repo.findAll(validatedFilter);
  }

  /**
   * Get employee by ID or throw NotFoundError.
   */
  async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.repo.findById(id);
    if (!employee) {
      throw new NotFoundError(`Employee with ID "${id}" not found`);
    }
    return employee;
  }

  /**
   * Create a new employee with unique email validation and team bindings.
   */
  async createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    const validated = createEmployeeSchema.parse(input);

    const existing = await this.repo.findByEmail(validated.email);
    if (existing) {
      throw new ConflictError(`Employee with email "${validated.email}" already exists`);
    }

    logger.info('Creating new employee profile', { email: validated.email });
    return this.repo.create(validated);
  }

  /**
   * Update an existing employee profile.
   */
  async updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    const validated = updateEmployeeSchema.parse(input);

    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Employee with ID "${id}" not found`);
    }

    if (validated.email && validated.email !== existing.email) {
      const emailConflict = await this.repo.findByEmail(validated.email);
      if (emailConflict && emailConflict.id !== id) {
        throw new ConflictError(`Employee with email "${validated.email}" already exists`);
      }
    }

    logger.info('Updating employee profile', { id });
    const updated = await this.repo.update(id, validated);
    if (!updated) {
      throw new NotFoundError(`Employee with ID "${id}" not found`);
    }
    return updated;
  }

  /**
   * Delete an employee profile and associated team memberships.
   */
  async deleteEmployee(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Employee with ID "${id}" not found`);
    }

    logger.info('Deleting employee profile', { id });
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Employee with ID "${id}" could not be deleted`);
    }
  }
}

export const employeeService = new EmployeeService();

