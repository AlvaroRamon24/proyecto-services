import { Router } from 'express';
import * as solicitudController from '../controllers/solicitud.controller.js';

const solicitudRouter = Router();

solicitudRouter.post('/', solicitudController.crearSolicitud);
solicitudRouter.get('/employee/:id', solicitudController.obtenerSolicitudesEmpleado);
solicitudRouter.post('/reject', solicitudController.rejectSolicitud);
solicitudRouter.get('/customer/:id', solicitudController.obtenerSolicitudesCliente);
solicitudRouter.post('/delete/:solicitudId', solicitudController.deleteRejectCustomer);
solicitudRouter.get('/usuario/:userId', solicitudController.getSearchUsuario);
solicitudRouter.post('/guardar', solicitudController.guardarSolicitudRun);
solicitudRouter.get('/run/:id', solicitudController.obtenerSolicitudRun);
solicitudRouter.post('/review', solicitudController.createReview);
solicitudRouter.get('/review-obtener/:id', solicitudController.getReview);

export default solicitudRouter;