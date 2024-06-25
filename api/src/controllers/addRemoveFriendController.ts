import {type Request, type Response} from 'express';
import {addRemoveFriend} from '../services/addRemoveFriendServices';

export const addRemoveFriendController = async (friendsTable: string, usersTable: string, req: Request, res: Response) => {
	try {
		const {type, friendId} = req.body as {type: string; friendId: number};
		const userId = res.locals.user.id as number;

		const friendship = await addRemoveFriend(friendsTable, usersTable, type, userId, friendId);

		return res.status(200).json(friendship);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
