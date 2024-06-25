import {type Request, type Response} from 'express';
import {type UsersParameters} from '../types/controllers/usersController.types';
import {getUsers} from '../models/userModels';

export const getUsersController = async (tableName: string, req: Request, res: Response) => {
	try {
		const {sort, page} = req.query as UsersParameters;
		const username = res.locals.user.username as string;

		const users = await getUsers(tableName, sort, page, 10);
		const usersWithoutActiveUser = users?.filter(user => user.username !== username);

		return res.status(200).json(usersWithoutActiveUser);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
