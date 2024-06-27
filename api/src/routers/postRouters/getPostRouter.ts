import express from 'express';
import {query} from 'express-validator';
import {getPostController} from '../../controllers/postControllers/getPostController';
import {verifyTokenMiddleware} from '../../middleware/verifyTokenMiddleware';
import {validatorMiddleware} from '../../middleware/validatorMiddleware';

export const getPostRouter = (postsTable: string, usersTable: string) => {
	const router = express.Router();

	router.get(
		'/getPost',
		verifyTokenMiddleware,
		query('postId').trim().toInt().isInt().withMessage('postId required'),
		validatorMiddleware,
		async (req, res) => getPostController(postsTable, usersTable, req, res),
	);

	return router;
};
