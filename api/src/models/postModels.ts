/* eslint-disable @typescript-eslint/naming-convention */
import {queryDb} from '../database/db';
import {type PostWithUserInfo, type Post} from '../types/models/postModels.types';
import {getUser} from './userModels';

export const createPost = async (tableName: string, userId: number, post: string, uploadedPicture?: string) => {
	try {
		const capitalizePost = post.slice(0, 1);
		const restPost = post.slice(1);

		const completePost = capitalizePost.toUpperCase() + restPost;

		if (uploadedPicture) {
			await queryDb(`
				INSERT INTO ${tableName} (user_id, post, post_picture)
				VALUES ($1, $2, $3)
			`, [userId, completePost, uploadedPicture]);
		} else {
			await queryDb(`
				INSERT INTO ${tableName} (user_id, post)
				VALUES ($1, $2)
			`, [userId, completePost]);
		}
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const getPost = async (postsTable: string, usersTable: string, postId: number) => {
	try {
		const postData = await queryDb(`
			SELECT * FROM ${postsTable}
			WHERE id = $1
		`, [postId]);

		const post = postData?.rows?.[0] as Post;
		const user = await getUser(usersTable, 'id', post?.user_id);

		if (!post) {
			throw new Error('No post found');
		}

		if (!user) {
			throw new Error('No user found');
		}

		const userDetails = {
			username: user.username,
			profile_picture: user.profile_picture,
		};

		if (post.post_picture === null) {
			const {post_picture, ...rest} = post;

			const updatedPost: PostWithUserInfo = {...rest, ...userDetails};
			return updatedPost;
		}

		const updatedPost: PostWithUserInfo = {...post, ...userDetails};

		return updatedPost;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const getPosts = async (postsTable: string, usersTable: string, sort = 'created_at', page = 0, limit = 10) => {
	try {
		const postData = await queryDb(`
			SELECT * FROM ${postsTable}
			ORDER BY ${sort} DESC
			LIMIT $1 OFFSET $2
		`, [limit, page * limit]);

		const posts = postData?.rows as Post[];

		if (!posts) {
			throw new Error('No posts found');
		}

		const updatedPostsPromises = posts.map(async post => {
			try {
				const user = await getUser(usersTable, 'id', post.user_id);

				if (!user) {
					throw new Error('No user found');
				}

				const userDetails = {
					username: user?.username,
					profile_picture: user?.profile_picture,
				};

				if (post.post_picture === null) {
					const {post_picture, ...rest} = post;

					return {...rest, ...userDetails};
				}

				return {...post, ...userDetails};
			} catch (error) {
				if (error instanceof Error) {
					throw error;
				}
			}
		});

		const updatedPosts = await Promise.all(updatedPostsPromises);

		return updatedPosts as PostWithUserInfo[];
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
