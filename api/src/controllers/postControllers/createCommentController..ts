import {type Request, type Response} from 'express';
import {createCommentService} from '../../services/postServices/createCommentService';

export const createCommentController = async (tableName: string, req: Request, res: Response) => {
	try {
		const userId = res.locals.user.id as number;
		const {
			commentText,
			postId,
			commentParentId,
		} = req.body as {
			commentText: string;
			postId: number;
			commentParentId?: number;
		};

		await createCommentService(tableName, userId, postId, commentText, commentParentId);

		return res.status(200).json({message: 'Created comment successfully'});
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
