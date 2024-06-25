import {type Request, type Response} from 'express';
import {getFriendship} from '../models/friendModels';

export const getFriendshipController = async (tableName: string, req: Request, res: Response) => {
	const {friendId} = req.query as unknown as {friendId: number};
	const usernameId = res.locals.user.id as number;

	const existingFriendship = await getFriendship(tableName, usernameId, friendId);

	if (existingFriendship) {
		return res.status(200).json(existingFriendship);
	}

	return res.status(200).json({});
};
