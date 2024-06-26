import express from 'express';
import {check} from 'express-validator';
import {escapeHtml} from '../../utilities/customSanitization';
import {multerConfig} from '../../utilities/multerConfig';
import {updateProfileController} from '../../controllers/authControllers/updateProfileController';
import {verifyTokenMiddleware} from '../../middleware/verifyTokenMiddleware';
import {validatorMiddleware} from '../../middleware/validatorMiddleware';

export const updateProfileRouter = (tableName: string) => {
	const router = express.Router();
	const upload = multerConfig();

	router.put(
		'/updateProfile',
		verifyTokenMiddleware,
		upload.single('profilePicture'),
		check('username').trim().customSanitizer(escapeHtml).isString().optional().withMessage('Username required'),
		check('password').trim().customSanitizer(escapeHtml).isString().optional().isLength({min: 6}).withMessage('Password must be at least 6 characters'),
		check('confirmPassword').trim().customSanitizer(escapeHtml).isString().optional().isLength({min: 6}).withMessage('Password must be at least 6 characters'),
		validatorMiddleware,
		async (req, res) => updateProfileController(tableName, req, res),
	);

	return router;
};
