import { teamRepository, TeamRepository } from '../repositories/teamRepository.js';
import { employeeRepository, EmployeeRepository } from '../repositories/employeeRepository.js';
import { Team, TeamMember, CreateTeamInput, UpdateTeamInput, AddTeamMemberInput, TeamFilterOptions } from '../types/team.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class TeamService {
  constructor(
    private teamRepo: TeamRepository = teamRepository,
    private empRepo: EmployeeRepository = employeeRepository
  ) {}

  /**
   * Retrieve all teams matching filter criteria.
   */
  async getTeams(filters: TeamFilterOptions = {}): Promise<Team[]> {
    return await this.teamRepo.findAll(filters);
  }

  /**
   * Retrieve single team by ID.
   */
  async getTeamById(id: string): Promise<Team> {
    const team = await this.teamRepo.findById(id);
    if (!team) {
      throw new NotFoundError(`Team with ID '${id}' not found`);
    }
    return team;
  }

  /**
   * Create a new team with unique name check and optional lead assignment.
   */
  async createTeam(input: CreateTeamInput): Promise<Team> {
    logger.info('Creating new team', { name: input.name, department: input.department });

    const existing = await this.teamRepo.findByName(input.name);
    if (existing) {
      throw new ConflictError(`Team with name '${input.name}' already exists`);
    }

    if (input.leadId) {
      const lead = await this.empRepo.findById(input.leadId);
      if (!lead) {
        throw new NotFoundError(`Designated team lead with ID '${input.leadId}' not found`);
      }
    }

    const created = await this.teamRepo.create(input);

    // Auto-enroll lead into employee_teams with role 'Lead'
    if (input.leadId) {
      await this.teamRepo.addMember(created.id, input.leadId, 'Lead');
    }

    return (await this.teamRepo.findById(created.id)) || created;
  }

  /**
   * Update an existing team profile.
   */
  async updateTeam(id: string, input: UpdateTeamInput): Promise<Team> {
    logger.info('Updating team profile', { id });

    const current = await this.teamRepo.findById(id);
    if (!current) {
      throw new NotFoundError(`Team with ID '${id}' not found`);
    }

    if (input.name && input.name.toLowerCase() !== current.name.toLowerCase()) {
      const duplicate = await this.teamRepo.findByName(input.name);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictError(`Team with name '${input.name}' already exists`);
      }
    }

    if (input.leadId && input.leadId !== current.leadId) {
      const lead = await this.empRepo.findById(input.leadId);
      if (!lead) {
        throw new NotFoundError(`Designated team lead with ID '${input.leadId}' not found`);
      }
      // Auto-enroll lead
      await this.teamRepo.addMember(id, input.leadId, 'Lead');
    }

    const updated = await this.teamRepo.update(id, input);
    if (!updated) {
      throw new NotFoundError(`Team with ID '${id}' not found after update`);
    }

    return updated;
  }

  /**
   * Delete a team profile and unlink member associations.
   */
  async deleteTeam(id: string): Promise<void> {
    logger.info('Deleting team', { id });

    const existing = await this.teamRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Team with ID '${id}' not found`);
    }

    const deleted = await this.teamRepo.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Failed to delete team with ID '${id}'`);
    }
  }

  /**
   * Add or update an employee member within a team.
   */
  async addMember(teamId: string, input: AddTeamMemberInput): Promise<void> {
    logger.info('Adding member to team', { teamId, employeeId: input.employeeId, role: input.role });

    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new NotFoundError(`Team with ID '${teamId}' not found`);
    }

    const employee = await this.empRepo.findById(input.employeeId);
    if (!employee) {
      throw new NotFoundError(`Employee with ID '${input.employeeId}' not found`);
    }

    await this.teamRepo.addMember(teamId, input.employeeId, input.role || 'Core Member');
  }

  /**
   * Remove an employee from a team roster.
   */
  async removeMember(teamId: string, employeeId: string): Promise<void> {
    logger.info('Removing member from team', { teamId, employeeId });

    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new NotFoundError(`Team with ID '${teamId}' not found`);
    }

    const removed = await this.teamRepo.removeMember(teamId, employeeId);
    if (!removed) {
      throw new NotFoundError(`Membership for employee '${employeeId}' in team '${teamId}' not found`);
    }
  }

  /**
   * Get all members in a team roster.
   */
  async getMembers(teamId: string): Promise<TeamMember[]> {
    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new NotFoundError(`Team with ID '${teamId}' not found`);
    }
    return await this.teamRepo.getMembers(teamId);
  }
}

export const teamService = new TeamService();
