import {type Request, type Response} from 'express';
import {type LoginRequestBody} from '../../types/controllers/loginController.types';
import {login} from '../../services/authServices/loginServices';
import {generateToken} from '../../utilities/tokenGenerator';

export const loginController = async (tableName: string, req: Request, res: Response) => {
	try {
		const {username, password} = req.body as LoginRequestBody;

		const user = await login(tableName, username, password);

		if (user) {
			const accessToken = generateToken(user, '7m');
			const refreshToken = generateToken(user, '7d');

			res.cookie('accessToken', accessToken, {maxAge: 8 * 60 * 1000, httpOnly: true});
			res.cookie('refreshToken', refreshToken, {maxAge: 8 * 24 * 60 * 60 * 1000, httpOnly: true});
			return res.status(201).json(user);
		}

		throw new Error('Error logging in');
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({error: error.message});
		}
	}
};
