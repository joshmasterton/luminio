import {type Request, type Response} from 'express';
import {getComments} from '../../models/commentModels';

export const getCommentsController = async (commentsTable: string, usersTable: string, req: Request, res: Response) => {
	try {
		const {sort, page, postId} = req.query as {
			sort?: string;
			page?: number;
			postId?: number;
		};

		if (!postId) {
			throw new Error('No postId found');
		}

		const comments = await getComments(commentsTable, usersTable, postId, sort, page);

		return res.status(200).json(comments);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
