import express, {type Request, type Response} from 'express';
import {query} from 'express-validator';
import {escapeHtml} from '../utilities/customSanitization';
import {usersController} from '../controllers/usersConroller';

export const usersRouter = (tableName: string) => {
	const router = express.Router();

	router.get(
		'/users',
		query('sort').trim().customSanitizer(escapeHtml).optional(),
		query('page').trim().optional().toInt().isInt(),
		async (req: Request, res: Response) => usersController(tableName, req, res),
	);

	return router;
};
