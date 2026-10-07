import { Request, Response, NextFunction } from 'express';
import { teamService, TeamService } from '../services/teamService.js';
import {
  validateCreateTeam,
  validateUpdateTeam,
  validateAddTeamMember,
  validateTeamFilters
} from '../validators/teamValidator.js';

export class TeamController {
  constructor(private readonly service: TeamService = teamService) {}

  getAllTeams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = validateTeamFilters({
        department: req.query.department as string | undefined,
        search: req.query.search as string | undefined
      });
      const data = await this.service.getTeams(filters);
      res.status(200).json({
        success: true,
        data,
        total: data.length
      });
    } catch (error) {
      next(error);
    }
  };

  getTeamById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const data = await this.service.getTeamById(id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  createTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedInput = validateCreateTeam(req.body);
      const data = await this.service.createTeam(validatedInput);
      res.status(201).json({
        success: true,
        data,
        message: 'Team created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  updateTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const validatedInput = validateUpdateTeam(req.body);
      const data = await this.service.updateTeam(id, validatedInput);
      res.status(200).json({
        success: true,
        data,
        message: 'Team updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.service.deleteTeam(id);
      res.status(200).json({
        success: true,
        message: 'Team deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  addMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const validatedInput = validateAddTeamMember(req.body);
      await this.service.addMember(id, validatedInput);
      const members = await this.service.getMembers(id);
      res.status(200).json({
        success: true,
        data: members,
        message: 'Member added to team successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const employeeId = req.params.employeeId as string;
      await this.service.removeMember(id, employeeId);
      res.status(200).json({
        success: true,
        message: 'Member removed from team successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  getTeamMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const data = await this.service.getMembers(id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };
}

export const teamController = new TeamController();
