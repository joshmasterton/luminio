import {type Request, type Response} from 'express';
import {addRemoveFriend} from '../services/addRemoveFriendServices';

export const addRemoveFriendController = async (tableName: string, req: Request, res: Response) => {
	try {
		const {type, friendUsername} = req.body as {type: string; friendUsername: string};
		const username = res.locals.user.username as string;

		const friendship = await addRemoveFriend(tableName, type, username, friendUsername);

		return res.status(200).json(friendship);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
