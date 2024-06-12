import {type Request, type Response} from 'express';
import {type SignupRequestBody} from '../types/controllers/signupController.types';
import {signup} from '../services/signupServices';
import {generateToken} from '../utilities/tokenGenerator';

export const signupController = async (tableName: string, req: Request, res: Response) => {
	try {
		const {username, email, password} = req.body as SignupRequestBody;
		const profilePicture = req.file;

		if (!profilePicture) {
			throw new Error('No profile picture selected');
		}

		const user = await signup(tableName, username, email, password, profilePicture);

		if (user) {
			const accessToken = generateToken(user, '7m');
			const refreshToken = generateToken(user, '7d');

			res.cookie('accessToken', accessToken, {maxAge: 7 * 60 * 1000});
			res.cookie('refreshToken', refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000});
			return res.status(201).json(user);
		}

		throw new Error('Error creating user');
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({error: error.message});
		}
	}
};
