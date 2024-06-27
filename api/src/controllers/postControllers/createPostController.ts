import {type Request, type Response} from 'express';
import {createPostService} from '../../services/postServices/createPostServices';

export const createPostController = async (tableName: string, req: Request, res: Response) => {
	try {
		const {post} = req.body as {post: string};
		const userId = res.locals.user.id as number;
		const postPicture = req.file;

		await createPostService(tableName, userId, post, postPicture);

		return res.status(200).json({message: 'Created post successfully'});
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
