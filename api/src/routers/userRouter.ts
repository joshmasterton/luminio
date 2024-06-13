import express from 'express';
import {verifyTokenMiddleware} from '../middleware/verifyTokenMiddleware';
import {userController} from '../controllers/userController';

export const userRouter = express.Router();

userRouter.get('/user', verifyTokenMiddleware, userController);
