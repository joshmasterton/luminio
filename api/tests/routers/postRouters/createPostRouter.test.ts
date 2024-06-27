import express, {type Express} from 'express';
import {
	beforeEach, afterEach, describe, test,
	expect,
} from 'vitest';
import {
	createPostsTable, createUsersTable, dropPostsTable, dropUsersTable,
} from '../../../src/database/db';
import {createPostRouter} from '../../../src/routers/postRouters/createPostRouter';
import {generateToken} from '../../../src/utilities/tokenGenerator';
import {mockUser} from '../../mockData/mockUser';
import {getPost} from '../../../src/models/postModels';
import {createUser} from '../../../src/models/userModels';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import path from 'path';

describe('/createPost', () => {
	let app: Express;
	let postsTable: string;
	let usersTable: string;

	beforeEach(async () => {
		postsTable = `luminio_posts_test_create_post_${Date.now()}`;
		usersTable = `luminio_users_test_create_post_${Date.now()}`;

		await dropPostsTable(postsTable);
		await dropUsersTable(usersTable);
		await createPostsTable(postsTable);
		await createUsersTable(usersTable);

		app = express();
		app.use(cookieParser());
		app.use(express.json());
		app.use(express.urlencoded({extended: false}));
		app.use(createPostRouter(postsTable));
	});

	afterEach(async () => {
		await dropUsersTable(usersTable);
		await dropPostsTable(postsTable);
	});

	test('Should return succesful post upload', async () => {
		await createUser(usersTable, 'testUser', 'test@email.com', 'Password', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		const accessToken = generateToken(mockUser, '7m');
		const refreshToken = generateToken(mockUser, '7d');

		const response = await request(app)
			.post('/createPost')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.field({
				post: 'test post',
			})
			.attach('postPicture', path.join(__dirname, '..', '..', './mockData/profilePictureTest.jpg'));

		const post = await getPost(postsTable, usersTable, 1);

		expect(response.body).toEqual({message: 'Created post successfully'});
		expect(post?.post).toBe('Test post');
		expect(post?.username).toBe('testUser');
		expect(post?.profile_picture).toBe('https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		expect(post?.post_picture).toBe('https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
	});

	test('Should return succesful post upload if no post image', async () => {
		await createUser(usersTable, 'testUser', 'test@email.com', 'Password', 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		const accessToken = generateToken(mockUser, '7m');
		const refreshToken = generateToken(mockUser, '7d');

		const response = await request(app)
			.post('/createPost')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.field({
				post: 'test post',
			});

		const post = await getPost(postsTable, usersTable, 1);

		expect(response.body).toEqual({message: 'Created post successfully'});
		expect(post?.post).toBe('Test post');
		expect(post?.username).toBe('testUser');
		expect(post?.profile_picture).toBe('https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg');
		expect(post?.post_picture).toBeUndefined();
	});

	test('Should return error if no post', async () => {
		const accessToken = generateToken(mockUser, '7m');
		const refreshToken = generateToken(mockUser, '7d');

		const response = await request(app)
			.post('/createPost')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.attach('postPicture', path.join(__dirname, '..', '..', './mockData/profilePictureTest.jpg'));

		expect(response.body).toEqual({error: 'Post cannot be empty'});
	});
});
