import express from 'express';
import {verifyTokenMiddleware} from '../../middleware/verifyTokenMiddleware';
import {query} from 'express-validator';
import {profileController} from '../../controllers/usersControllers/profileController';

export const profileRouter = (tableName: string) => {
	const router = express.Router();

	router.get(
		'/profile',
		verifyTokenMiddleware,
		query('userId').trim().toInt().isInt().notEmpty().withMessage('UserId required'),
		async (req, res) => profileController(tableName, req, res),
	);

	return router;
};
