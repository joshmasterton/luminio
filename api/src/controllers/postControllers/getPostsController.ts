import {type Request, type Response} from 'express';
import {type UsersParameters} from '../../types/controllers/usersController.types';
import {getPosts} from '../../models/postModels';

export const getPostsController = async (postsTable: string, usersTable: string, req: Request, res: Response) => {
	try {
		const {sort, page} = req.query as UsersParameters;

		const posts = await getPosts(postsTable, usersTable, sort, page);

		return res.status(200).json(posts);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
