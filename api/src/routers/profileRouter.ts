import express from 'express';
import {verifyTokenMiddleware} from '../middleware/verifyTokenMiddleware';
import {query} from 'express-validator';
import {escapeHtml} from '../utilities/customSanitization';
import {profileController} from '../controllers/profileController';

export const profileRouter = (tableName: string) => {
	const router = express.Router();

	router.get(
		'/profile',
		query('username').trim().customSanitizer(escapeHtml).isString().notEmpty().withMessage('Username required'),
		verifyTokenMiddleware,
		async (req, res) => profileController(tableName, req, res),
	);

	return router;
};
