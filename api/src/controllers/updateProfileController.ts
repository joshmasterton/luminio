import {type Request, type Response} from 'express';
import {updateProfile} from '../services/updateProfileServices';
import {generateToken} from '../utilities/tokenGenerator';

export const updateProfileController = async (tableName: string, req: Request, res: Response) => {
	try {
		const oldUsername = res.locals.user.username as string;
		let {username} = req.body as {username: string | undefined};
		const profilePicture = req.file;

		if (oldUsername === username) {
			username = undefined;
		}

		const updatedProfile = await updateProfile(tableName, oldUsername, username, profilePicture);

		if (updatedProfile) {
			const accessToken = generateToken(updatedProfile, '7m');
			const refreshToken = generateToken(updatedProfile, '7d');

			res.clearCookie('accessToken');
			res.clearCookie('refreshToken');
			res.cookie('accessToken', accessToken, {maxAge: 8 * 60 * 1000, httpOnly: true});
			res.cookie('refreshToken', refreshToken, {maxAge: 8 * 24 * 60 * 60 * 1000, httpOnly: true});
			return res.status(201).json(updatedProfile);
		}

		throw new Error('Error updating user');
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({error: error.message});
		}
	}
};
