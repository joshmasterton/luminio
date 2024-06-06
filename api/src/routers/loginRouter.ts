import express from 'express';
import {validatorMiddleware} from '../middleware/validatorMiddleware';
import {check} from 'express-validator';

export const loginRouter = express.Router();

loginRouter.post(
	'/',
	check('username').trim().isString().notEmpty().withMessage('Username required'),
	check('password').trim().isString().notEmpty().withMessage('Password required'),
	validatorMiddleware,
	(_req, res) => res.status(200).json({message: 'Login successful'}),
);
