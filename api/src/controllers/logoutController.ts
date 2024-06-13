import {type Request, type Response} from 'express';

export const logoutController = async (_req: Request, res: Response) => {
	res.clearCookie('accessToken');
	res.clearCookie('refreshToken');

	return res.status(200).json({message: 'Logged out successfully'});
};
