import express, {type Express} from 'express';
import {afterEach} from 'node:test';
import {
	beforeEach, describe, expect, test,
} from 'vitest';
import {
	createCommentsTable, createPostsTable, createUsersTable, dropCommentsTable, dropPostsTable, dropUsersTable,
} from '../../../src/database/db';
import {createUser} from '../../../src/models/userModels';
import {generateToken} from '../../../src/utilities/tokenGenerator';
import {createPost, getPost} from '../../../src/models/postModels';
import {getCommentsRouter} from '../../../src/routers/postRouters/getCommentsRouter';
import {createComment, getComment} from '../../../src/models/commentModels';
import request from 'supertest';
import cookieParser from 'cookie-parser';

describe('/getPosts', () => {
	let app: Express;
	let commentsTable: string;
	let usersTable: string;
	let postsTable: string;

	beforeEach(async () => {
		commentsTable = `luminio_comments_test_get_comments_${Date.now()}`;
		usersTable = `luminio_users_test_get_comments_${Date.now()}`;
		postsTable = `luminio_posts_test_get_comments_${Date.now()}`;

		await dropCommentsTable(commentsTable);
		await dropUsersTable(usersTable);
		await dropPostsTable(postsTable);
		await createCommentsTable(commentsTable);
		await createUsersTable(usersTable);
		await createPostsTable(postsTable);

		app = express();
		app.use(cookieParser());
		app.use(express.json());
		app.use(express.urlencoded({extended: false}));
		app.use(getCommentsRouter(commentsTable, usersTable));
	});

	afterEach(async () => {
		await dropCommentsTable(commentsTable);
		await dropUsersTable(usersTable);
		await dropPostsTable(postsTable);
	});

	test('Should return comments', async () => {
		const user = await createUser(usersTable, 'testUser', 'test@email.com', 'Password', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		const accessToken = generateToken(user!, '7m');
		const refreshToken = generateToken(user!, '7d');

		await createPost(postsTable, user!.id, 'test post');
		const post = await getPost(postsTable, usersTable, 1);

		await createComment(commentsTable, user!.id, post!.id, 'Test comment two');

		const comment = await getComment(commentsTable, usersTable, 1);
		await createComment(commentsTable, user!.id, post!.id, 'Test comment two', comment?.id);

		const commentTwo = await getComment(commentsTable, usersTable, 2);
		await createComment(commentsTable, user!.id, post!.id, 'Test comment two', commentTwo!.id);

		const response = await request(app)
			.get('/getComments')
			.query({
				postId: 1,
			})
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);

		expect(response.body).toHaveLength(3);
	});
});
