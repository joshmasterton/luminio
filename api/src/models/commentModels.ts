/* eslint-disable @typescript-eslint/naming-convention */
import {queryDb} from '../database/db';
import {type Comment, type CommentWithUserInfo} from '../types/models/commentModels.types';
import {getUser} from './userModels';

export const createComment = async (
	tableName: string,
	userId: number,
	postId: number,
	commentText: string,
	commentParentId?: number,
) => {
	try {
		const capitalizeComment = commentText.slice(0, 1);
		const restComment = commentText.slice(1);

		const completeComment = capitalizeComment.toUpperCase() + restComment;

		await queryDb(`
			INSERT INTO ${tableName} (user_id, post_id, comment, comment_parent_id)
			VALUES ($1, $2, $3, $4)
		`, [userId, postId, completeComment, commentParentId ?? null]);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const getComment = async (commentsTable: string, usersTable: string, commentId: number) => {
	try {
		const commentData = await queryDb(`
			SELECT * FROM ${commentsTable}
			WHERE id = $1
		`, [commentId]);

		const comment = commentData?.rows?.[0] as Comment;
		const user = await getUser(usersTable, 'id', comment?.user_id);

		if (!comment) {
			throw new Error('No comment found');
		}

		if (!user) {
			throw new Error('No user found');
		}

		const userDetails = {
			username: user.username,
			profile_picture: user.profile_picture,
		};

		const updatedComment: CommentWithUserInfo = {...comment, ...userDetails};

		return updatedComment;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const getComments = async (
	commentsTable: string,
	usersTable: string,
	postId: number,
	sort = 'created_at',
	page = 0, limit = 10,
) => {
	try {
		const commentsData = await queryDb(`
			SELECT * FROM ${commentsTable}
			WHERE post_id = $1
			ORDER BY ${sort} DESC
			LIMIT $2 OFFSET $3
		`, [postId, limit, page * limit]);

		const comments = commentsData?.rows as Comment[];

		if (!comments) {
			throw new Error('No comments found');
		}

		const updatedCommentsPromises = comments.map(async comment => {
			try {
				const user = await getUser(usersTable, 'id', comment.user_id);

				if (!user) {
					throw new Error('No user found');
				}

				const userDetails = {
					username: user?.username,
					profile_picture: user?.profile_picture,
				};

				return {...comment, ...userDetails};
			} catch (error) {
				if (error instanceof Error) {
					throw error;
				}
			}
		});

		const updatedComments = await Promise.all(updatedCommentsPromises);

		return updatedComments as CommentWithUserInfo[];
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
