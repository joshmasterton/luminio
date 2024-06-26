import express from 'express';
import {validatorMiddleware} from '../../middleware/validatorMiddleware';
import {check} from 'express-validator';
import {loginController} from '../../controllers/authControllers/loginController';
import {escapeHtml} from '../../utilities/customSanitization';

export const loginRouter = (tableName: string) => {
	const router = express.Router();

	router.post(
		'/login',
		check('username').trim().customSanitizer(escapeHtml).isString().notEmpty().withMessage('Username required'),
		check('password').trim().customSanitizer(escapeHtml).isString().notEmpty().withMessage('Password required'),
		validatorMiddleware,
		async (req, res) => loginController(tableName, req, res),
	);

	return router;
};
