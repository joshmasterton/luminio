import express from 'express';
import {verifyTokenMiddleware} from '../../middleware/verifyTokenMiddleware';
import {getFriendsController} from '../../controllers/friendshipsControllers/getFriendsController';
import {query} from 'express-validator';
import {escapeHtml} from '../../utilities/customSanitization';

export const getFriendsRouter = (friendsTable: string, usersTable: string) => {
	const router = express.Router();

	router.get(
		'/getFriends',
		verifyTokenMiddleware,
		query('accepted').trim().toBoolean().isBoolean().optional(),
		query('searchQuery').trim().customSanitizer(escapeHtml).optional(),
		query('sort').trim().customSanitizer(escapeHtml).optional(),
		query('page').trim().optional().toInt().isInt(),
		query('userId').trim().toInt().isInt().withMessage('userId required'),
		async (req, res) => getFriendsController(friendsTable, usersTable, req, res),
	);

	return router;
};
