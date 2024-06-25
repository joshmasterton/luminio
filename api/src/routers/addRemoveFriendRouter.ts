import express from 'express';
import {validatorMiddleware} from '../middleware/validatorMiddleware';
import {check} from 'express-validator';
import {escapeHtml} from '../utilities/customSanitization';
import {addRemoveFriendController} from '../controllers/addRemoveFriendController';
import {verifyTokenMiddleware} from '../middleware/verifyTokenMiddleware';

export const addRemoveFriendRouter = (friendsTable: string, usersTable: string) => {
	const router = express.Router();

	router.post(
		'/addRemoveFriend',
		verifyTokenMiddleware,
		check('type').trim().customSanitizer(escapeHtml).isString().notEmpty().withMessage('Friendship type missing'),
		check('friendId').trim().toInt().isInt().notEmpty().withMessage('Friend id missing'),
		validatorMiddleware,
		async (req, res) => addRemoveFriendController(friendsTable, usersTable, req, res),
	);

	return router;
};
