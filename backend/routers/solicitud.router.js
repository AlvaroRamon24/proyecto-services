import { Router } from 'express';
import * as solicitudController from '../controllers/solicitud.controller.js';

const solicitudRouter = Router();

solicitudRouter.post('/', solicitudController.crearSolicitud);
solicitudRouter.get('/employee/:id', solicitudController.obtenerSolicitudesEmpleado);
solicitudRouter.post('/reject', solicitudController.rejectSolicitud);
solicitudRouter.get('/customer/:id', solicitudController.obtenerSolicitudesCliente);
solicitudRouter.post('/delete/:solicitudId', solicitudController.deleteRejectCustomer);
solicitudRouter.get('/usuario/:userId', solicitudController.getSearchUsuario);
export default solicitudRouter;