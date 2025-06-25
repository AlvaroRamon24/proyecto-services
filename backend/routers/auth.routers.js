import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { verifyToken } from "../config/verify.js";

const authRouter = Router();

authRouter.post('/register', authController.RegisterAuth);
authRouter.post('/login', authController.LoginAuth);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/verify-email', authController.verifyEmail);
authRouter.post('/', verifyToken, authController.createRequest);
authRouter.get('/see-requests', verifyToken, authController.seeRequest);

export default authRouter;