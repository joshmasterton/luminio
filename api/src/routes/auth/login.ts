import express from 'express';
import {validator} from '../../middleware/validator';
import {check} from 'express-validator';

export const login = express.Router();

login.post(
	'/',
	check('username').trim().isString().notEmpty().withMessage('Username required'),
	check('password').trim().isString().notEmpty().withMessage('Password required'),
	validator,
	(_req, res) => res.status(200).json({message: 'Login successful'}),
);
