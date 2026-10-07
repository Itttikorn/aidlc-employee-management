import { Router } from 'express';
import { taskController } from '../controllers/taskController.js';

export const taskRouter = Router();

// Task CRUD routes
taskRouter.get('/', taskController.getAllTasks);
taskRouter.get('/:id', taskController.getTaskById);
taskRouter.post('/', taskController.createTask);
taskRouter.put('/:id', taskController.updateTask);
taskRouter.patch('/:id/status', taskController.updateTaskStatus);
taskRouter.delete('/:id', taskController.deleteTask);
