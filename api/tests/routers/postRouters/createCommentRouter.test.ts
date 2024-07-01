import express, {type Express} from 'express';
import {
	beforeEach, afterEach, describe, test, expect,
} from 'vitest';
import {
	createCommentsTable, createPostsTable, createUsersTable, dropCommentsTable, dropPostsTable, dropUsersTable,
} from '../../../src/database/db';
import {generateToken} from '../../../src/utilities/tokenGenerator';
import {createComment, getComment} from '../../../src/models/commentModels';
import {createPost, getPost} from '../../../src/models/postModels';
import {createUser} from '../../../src/models/userModels';
import {createCommentRouter} from '../../../src/routers/postRouters/createCommentRouter';
import request from 'supertest';
import cookieParser from 'cookie-parser';

describe('/createPost', () => {
	let app: Express;
	let commentsTable: string;
	let usersTable: string;
	let postsTable: string;

	beforeEach(async () => {
		commentsTable = `luminio_comments_test_create_comment_${Date.now()}`;
		usersTable = `luminio_users_test_create_comment_${Date.now()}`;
		postsTable = `luminio_posts_test_create_comment_${Date.now()}`;

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
		app.use(createCommentRouter(commentsTable));
	});

	afterEach(async () => {
		await dropUsersTable(usersTable);
		await dropCommentsTable(commentsTable);
		await dropPostsTable(postsTable);
	});

	test('Should return succesful comment upload', async () => {
		const user = await createUser(usersTable, 'testUser', 'test@email.com', 'Password', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');

		await createPost(postsTable, user!.id, 'test post');
		const post = await getPost(postsTable, usersTable, 1);

		const accessToken = generateToken(user!, '7m');
		const refreshToken = generateToken(user!, '7d');

		const response = await request(app)
			.post('/createComment')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.send({
				commentText: 'test comment',
				postId: post!.id,
			});

		const comment = await getComment(commentsTable, usersTable, 1);

		expect(response.body).toEqual({message: 'Created comment successfully'});
		expect(comment?.id).toBe(1);
		expect(comment?.user_id).toBe(user!.id);
		expect(comment?.comment_parent_id).toBeNull();
	});

	test('Should return succesful comment upload with parent id', async () => {
		const user = await createUser(usersTable, 'testUser', 'test@email.com', 'Password', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');

		await createPost(postsTable, user!.id, 'test post');
		const post = await getPost(postsTable, usersTable, 1);

		const accessToken = generateToken(user!, '7m');
		const refreshToken = generateToken(user!, '7d');

		const response = await request(app)
			.post('/createComment')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.send({
				commentText: 'test comment',
				postId: post!.id,
			});

		const comment = await getComment(commentsTable, usersTable, 1);
		await createComment(commentsTable, user!.id, post!.id, 'Test comment two', comment?.id);

		const commentTwo = await getComment(commentsTable, usersTable, 2);
		await createComment(commentsTable, user!.id, post!.id, 'Test comment two', commentTwo!.id);

		const commentThree = await getComment(commentsTable, usersTable, 3);

		expect(response.body).toEqual({message: 'Created comment successfully'});

		expect(comment?.id).toBe(1);
		expect(comment?.user_id).toBe(user!.id);
		expect(comment?.comment_parent_id).toBeNull();

		expect(commentTwo?.comment_parent_id).toBe(1);

		expect(commentThree?.comment_parent_id).toBe(2);
	});
});
