import express from 'express';
import {query} from 'express-validator';
import {verifyTokenMiddleware} from '../../middleware/verifyTokenMiddleware';
import {validatorMiddleware} from '../../middleware/validatorMiddleware';
import {escapeHtml} from '../../utilities/customSanitization';
import {getCommentsController} from '../../controllers/postControllers/getCommentsController';

export const getCommentsRouter = (commentsTable: string, usersTable: string) => {
	const router = express.Router();

	router.get(
		'/getComments',
		verifyTokenMiddleware,
		query('sort').trim().customSanitizer(escapeHtml).optional(),
		query('page').trim().optional().toInt().isInt(),
		query('postId').trim().toInt().isInt().withMessage('postId required'),
		validatorMiddleware,
		async (req, res) => getCommentsController(commentsTable, usersTable, req, res),
	);

	return router;
};
