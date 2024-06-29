import {type Request, type Response} from 'express';
import {getFriendship} from '../../models/friendModels';

export const getFriendshipController = async (tableName: string, req: Request, res: Response) => {
	try {
		const {friendId} = req.query as unknown as {friendId: number};
		const userId = res.locals.user.id as number;

		const existingFriendship = await getFriendship(tableName, userId, friendId);

		if (existingFriendship) {
			return res.status(200).json(existingFriendship);
		}

		return res.status(200).json({});
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
