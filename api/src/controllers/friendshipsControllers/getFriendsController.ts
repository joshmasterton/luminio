import {type Request, type Response} from 'express';
import {getFriends} from '../../models/friendModels';

export const getFriendsController = async (friendsTable: string, usersTable: string, req: Request, res: Response) => {
	try {
		const {
			sort, page, userId, searchQuery, accepted,
		} = req.query as unknown as {
			sort: string; page: number; userId: number; searchQuery: string; accepted: boolean;
		};

		const friends = await getFriends(friendsTable, usersTable, userId, sort, page, 10, accepted);

		if (!friends) {
			return res.status(500).json({error: 'No friends'});
		}

		if (searchQuery) {
			const filteredFriends = friends.filter(friend => friend.username.toLowerCase().includes(searchQuery.toLowerCase()));
			return res.status(200).json(filteredFriends);
		}

		return res.status(200).json(friends);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
