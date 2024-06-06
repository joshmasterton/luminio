import {type Request, type Response} from 'express';
import {type SignupRequestBody} from '../../types/routers/signupRouterTypes';
import {signup} from '../../services/signupServices';

export const signupController = async (req: Request, res: Response) => {
	try {
		const {username, email, password} = req.body as SignupRequestBody;
		const profilePicture = req.file;

		if (!profilePicture) {
			throw new Error('No profile picture selected');
		}

		const user = await signup(username, email, password, profilePicture.originalname);
		return res.status(201).json(user);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({error: error.message});
		}
	}
};
