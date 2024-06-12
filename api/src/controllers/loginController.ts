import {type Request, type Response} from 'express';
import {type LoginRequestBody} from '../types/controllers/loginController.types';
import {login} from '../services/loginServices';
import {generateToken} from '../utilities/tokenGenerator';

export const loginController = async (tableName: string, req: Request, res: Response) => {
	try {
		const {username, password} = req.body as LoginRequestBody;

		const user = await login(tableName, username, password);

		if (user) {
			const accessToken = generateToken(user, '7m');
			const refreshToken = generateToken(user, '7d');

			res.cookie('accessToken', accessToken, {maxAge: 7 * 60 * 1000});
			res.cookie('refreshToken', refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000});
			return res.status(201).json(user);
		}

		throw new Error('Error logging in');
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({error: error.message});
		}
	}
};
