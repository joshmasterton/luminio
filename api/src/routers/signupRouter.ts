import express from 'express';
import {validatorMiddleware} from '../middleware/validatorMiddleware';
import {check} from 'express-validator';
import {multerConfig} from '../utilities/multerConfig';
import {signupController} from '../controllers/authControllers/signupController';

export const signupRouter = express.Router();

const upload = multerConfig();

signupRouter.post(
	'/',
	upload.single('profilePicture'),
	check('username').trim().isString().notEmpty().withMessage('Username required'),
	check('email').trim().isEmail().withMessage('Email required'),
	check('password').trim().isString().isLength({min: 6}).withMessage('Password must be at least 6 characters'),
	check('confirmPassword').trim().custom((value, {req}) => value === req.body.password).withMessage('Passwords must match'),
	validatorMiddleware,
	signupController,
);
