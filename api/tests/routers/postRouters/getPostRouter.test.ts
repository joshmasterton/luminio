import express, {type Express} from 'express';
import {afterEach} from 'node:test';
import {
	beforeEach, describe, expect, test,
} from 'vitest';
import {
	createPostsTable, createUsersTable, dropPostsTable, dropUsersTable,
} from '../../../src/database/db';
import {getPostRouter} from '../../../src/routers/postRouters/getPostRouter';
import {createUser} from '../../../src/models/userModels';
import {generateToken} from '../../../src/utilities/tokenGenerator';
import {createPost} from '../../../src/models/postModels';
import request from 'supertest';
import cookieParser from 'cookie-parser';

describe('/getPost', () => {
	let app: Express;
	let postsTable: string;
	let usersTable: string;

	beforeEach(async () => {
		postsTable = `luminio_posts_test_get_post_${Date.now()}`;
		usersTable = `luminio_users_test_get_post_${Date.now()}`;

		await dropPostsTable(postsTable);
		await dropUsersTable(usersTable);
		await createPostsTable(postsTable);
		await createUsersTable(usersTable);

		app = express();
		app.use(cookieParser());
		app.use(express.json());
		app.use(express.urlencoded({extended: false}));
		app.use(getPostRouter(postsTable, usersTable));
	});

	afterEach(async () => {
		await dropPostsTable(postsTable);
		await dropUsersTable(usersTable);
	});

	test('Should return a post', async () => {
		const user = await createUser(usersTable, 'testUser', 'test@email.com', 'Password', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		const accessToken = generateToken(user!, '7m');
		const refreshToken = generateToken(user!, '7d');
		await createPost(postsTable, user!.id, 'test post');

		const response = await request(app)
			.get(`/getPost?postId=${1}`)
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);

		expect(response.body.post).toBe('Test post');
		expect(response.body.username).toBe('testUser');
		expect(response.body.profile_picture).toBe('https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		expect(response.body.post_picture).toBeUndefined();
	});
});
