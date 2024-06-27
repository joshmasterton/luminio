import express from 'express';
import {verifyTokenMiddleware} from '../../../src/middleware/verifyTokenMiddleware';
import {check} from 'express-validator';
import {escapeHtml} from '../../utilities/customSanitization';
import {validatorMiddleware} from '../../middleware/validatorMiddleware';
import {createPostController} from '../../controllers/postControllers/createPostController';
import {multerConfig} from '../../utilities/multerConfig';

export const createPostRouter = (tableName: string) => {
	const router = express.Router();
	const upload = multerConfig();

	router.post(
		'/createPost',
		upload.single('postPicture'),
		verifyTokenMiddleware,
		check('post').trim().customSanitizer(escapeHtml).isString().notEmpty().withMessage('Post cannot be empty'),
		validatorMiddleware,
		async (req, res) => createPostController(tableName, req, res),
	);

	return router;
};
