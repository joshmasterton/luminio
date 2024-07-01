import express from 'express';
import {check} from 'express-validator';
import {escapeHtml} from '../../utilities/customSanitization';
import {createCommentController} from '../../controllers/postControllers/createCommentController.';
import {verifyTokenMiddleware} from '../../middleware/verifyTokenMiddleware';
import {validatorMiddleware} from '../../middleware/validatorMiddleware';

export const createCommentRouter = (tableName: string) => {
	const router = express.Router();

	router.post(
		'/createComment',
		verifyTokenMiddleware,
		check('commentText').trim().customSanitizer(escapeHtml).isString().notEmpty().withMessage('Comment cannot be empty'),
		check('postId').trim().toInt().isInt().withMessage('postId required'),
		check('commentParentId').trim().toInt().isInt().optional().withMessage('commentId invalid'),
		validatorMiddleware,
		async (req, res) => createCommentController(tableName, req, res),
	);

	return router;
};
