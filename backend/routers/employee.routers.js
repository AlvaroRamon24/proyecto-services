import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller.js';
import { verifyToken } from '../config/verify.js';
import upload from "../middlewares/upload.js";

const employeeRouter = Router();

employeeRouter.get('/', employeeController.getAllEmployees);
employeeRouter.get('/:id', employeeController.getEmployeeById);
employeeRouter.put('/update/:id', employeeController.updateEmployee);
employeeRouter.delete('/delete/:id', employeeController.deleteEmployee);

export default employeeRouter;