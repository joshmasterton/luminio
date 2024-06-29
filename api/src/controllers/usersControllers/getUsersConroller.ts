import {type Request, type Response} from 'express';
import {type UsersParameters} from '../../types/controllers/usersController.types';
import {getUsers} from '../../models/userModels';

export const getUsersController = async (tableName: string, req: Request, res: Response) => {
	try {
		const {sort, page, searchQuery} = req.query as UsersParameters;
		const username = res.locals.user.username as string;

		const users = await getUsers(tableName, sort, page);
		const usersWithoutActiveUser = users?.filter(user => user.username !== username);
		if (searchQuery) {
			const filteredUsers = usersWithoutActiveUser?.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
			return res.status(200).json(filteredUsers);
		}

		return res.status(200).json(usersWithoutActiveUser);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
