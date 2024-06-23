import express from 'express';
import {validatorMiddleware} from '../middleware/validatorMiddleware';
import {check} from 'express-validator';
import {escapeHtml} from '../utilities/customSanitization';
import {addRemoveFriendController} from '../controllers/addRemoveFriendController';
import {verifyTokenMiddleware} from '../middleware/verifyTokenMiddleware';

export const addRemoveFriendRouter = (tableName: string) => {
	const router = express.Router();

	router.post(
		'/addRemoveFriend',
		verifyTokenMiddleware,
		check('type').trim().customSanitizer(escapeHtml).isString().notEmpty().withMessage('Friendship type missing'),
		check('friendUsername').trim().customSanitizer(escapeHtml).isString().notEmpty().withMessage('Friend username missing'),
		validatorMiddleware,
		async (req, res) => addRemoveFriendController(tableName, req, res),
	);

	return router;
};
