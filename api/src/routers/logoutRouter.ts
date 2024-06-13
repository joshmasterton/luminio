import express from 'express';
import {logoutController} from '../controllers/logoutController';
import {verifyTokenMiddleware} from '../middleware/verifyTokenMiddleware';

export const logoutRouter = express.Router();

logoutRouter.post('/logout', verifyTokenMiddleware, logoutController);
