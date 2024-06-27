import {type Request, type Response} from 'express';
import {getPost} from '../../models/postModels';

export const getPostController = async (postsTable: string, usersTable: string, req: Request, res: Response) => {
	try {
		const {postId} = req.query as unknown as {postId: number};

		const post = await getPost(postsTable, usersTable, postId);

		return res.status(200).json(post);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
		}
	}
};
