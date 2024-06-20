import {type Request, type Response} from 'express';
import {type UsersParameters} from '../types/controllers/usersController.types';
import {getUsers} from '../models/userModels';

export const usersController = async (tableName: string, req: Request, res: Response) => {
	try {
		const {sort, page} = req.query as UsersParameters;

		const users = await getUsers(tableName, sort, page, 10);

		return res.status(200).json(users);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
