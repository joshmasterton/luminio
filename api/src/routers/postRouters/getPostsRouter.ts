import express from 'express';
import {query} from 'express-validator';
import {verifyTokenMiddleware} from '../../middleware/verifyTokenMiddleware';
import {validatorMiddleware} from '../../middleware/validatorMiddleware';
import {escapeHtml} from '../../utilities/customSanitization';
import {getPostsController} from '../../controllers/postControllers/getPostsController';

export const getPostsRouter = (postsTable: string, usersTable: string) => {
	const router = express.Router();

	router.get(
		'/getPosts',
		verifyTokenMiddleware,
		query('sort').trim().customSanitizer(escapeHtml).optional(),
		query('page').trim().optional().toInt().isInt(),
		validatorMiddleware,
		async (req, res) => getPostsController(postsTable, usersTable, req, res),
	);

	return router;
};
