import express from 'express';
import {verfiyTokenMiddleware} from '../middleware/verifyTokenMiddleware';
import {userController} from '../controllers/userController';

export const userRouter = express.Router();

userRouter.get('/user', verfiyTokenMiddleware, userController);
