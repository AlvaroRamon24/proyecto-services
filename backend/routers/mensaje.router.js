import { Router } from 'express';
import * as mensajesController from '../controllers/mensaje.controller.js';

const mensajeRouter = Router();

mensajeRouter.post('/', mensajesController.saveMensaje);
mensajeRouter.get('/history/:roomId', mensajesController.getMensajesByRoomId);
mensajeRouter.get('/conversaciones', mensajesController.getConversacionesPorUsuario);

export default mensajeRouter;