import { Router } from 'express';
import * as solicitudController from '../controllers/solicitud.controller.js';

const solicitudRouter = Router();

solicitudRouter.post('/', solicitudController.crearSolicitud);
solicitudRouter.get('/employee/:id', solicitudController.obtenerSolicitudesEmpleado);
solicitudRouter.post('/reject', solicitudController.rejectSolicitud);
solicitudRouter.get('/customer/:id', solicitudController.obtenerSolicitudesCliente);
solicitudRouter.post('/delete/:solicitudId', solicitudController.deleteRejectCustomer);
solicitudRouter.get('/usuario/:userId', solicitudController.getSearchUsuario);
solicitudRouter.post('/guardar-customer', solicitudController.guardarSolicitudCustomerRun);
solicitudRouter.post('/guardar-employee', solicitudController.guardarSolicitudEmployeeRun);
solicitudRouter.put('/update/:solicitudId', solicitudController.updateSolicitud);
solicitudRouter.get('/customer/run/:id', solicitudController.obtenerSolicitudCustomerRun);
solicitudRouter.get('/employee/run/:id', solicitudController.obtenerSolicitudEmployeeRun);
solicitudRouter.post('/review', solicitudController.createReview);
solicitudRouter.get('/user/:userType/review-obtener/:id', solicitudController.getReview);
solicitudRouter.put('/update-solicitudCustomerRun/:id', solicitudController.updateSolicitudCustomerRunId);
solicitudRouter.put('/update-solicitudEmployeeRun/:id', solicitudController.updateSolicitudEmployeeRunId);

export default solicitudRouter;