import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/chats-close', userController.saveChatCerrados);
userRouter.get('/chats/customer/:id', userController.getUsersChatsClose);

export default userRouter;