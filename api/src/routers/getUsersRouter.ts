import express, {type Request, type Response} from 'express';
import {query} from 'express-validator';
import {escapeHtml} from '../utilities/customSanitization';
import {getUsersController} from '../controllers/getUsersConroller';
import {verifyTokenMiddleware} from '../middleware/verifyTokenMiddleware';

export const getUsersRouter = (tableName: string) => {
	const router = express.Router();

	router.get(
		'/getUsers',
		verifyTokenMiddleware,
		query('sort').trim().customSanitizer(escapeHtml).optional(),
		query('page').trim().optional().toInt().isInt(),
		async (req: Request, res: Response) => getUsersController(tableName, req, res),
	);

	return router;
};
