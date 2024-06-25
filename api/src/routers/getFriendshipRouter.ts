import express from 'express';
import {query} from 'express-validator';
import {getFriendshipController} from '../controllers/getFriendshipController';
import {verifyTokenMiddleware} from '../middleware/verifyTokenMiddleware';

export const getFriendshipRouter = (tableName: string) => {
	const router = express.Router();

	router.get(
		'/getFriendship',
		verifyTokenMiddleware,
		query('friendId').trim().toInt().isInt().notEmpty().withMessage('friendId missing'),
		async (req, res) => getFriendshipController(tableName, req, res),
	);

	return router;
};
