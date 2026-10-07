import { Router } from 'express';
import { employeeController } from '../controllers/employeeController.js';

export const employeeRouter = Router();

employeeRouter.get('/', employeeController.getAll);
employeeRouter.get('/:id', employeeController.getById);
employeeRouter.post('/', employeeController.create);
employeeRouter.put('/:id', employeeController.update);
employeeRouter.patch('/:id', employeeController.update);
employeeRouter.delete('/:id', employeeController.delete);

