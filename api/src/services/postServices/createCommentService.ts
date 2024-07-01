import {createComment} from '../../models/commentModels';

export const createCommentService = async (
	tableName: string,
	userId: number,
	postId: number,
	commentText: string,
	commentParentId?: number,
) => {
	try {
		await createComment(tableName, userId, postId, commentText, commentParentId);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
