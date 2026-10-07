import { Router } from 'express';
import { teamController } from '../controllers/teamController.js';

export const teamRouter = Router();

// Team CRUD routes
teamRouter.get('/', teamController.getAllTeams);
teamRouter.get('/:id', teamController.getTeamById);
teamRouter.post('/', teamController.createTeam);
teamRouter.put('/:id', teamController.updateTeam);
teamRouter.delete('/:id', teamController.deleteTeam);

// Team Member Roster routes
teamRouter.get('/:id/members', teamController.getTeamMembers);
teamRouter.post('/:id/members', teamController.addMember);
teamRouter.delete('/:id/members/:employeeId', teamController.removeMember);
