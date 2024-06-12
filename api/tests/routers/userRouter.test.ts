/* eslint-disable @typescript-eslint/naming-convention */
import cookieParser from 'cookie-parser';
import request from 'supertest';
import express, {type Express} from 'express';
import {
	beforeEach, describe, expect, test,
} from 'vitest';
import {userRouter} from '../../src/routers/userRouter';
import {generateToken} from '../../src/utilities/tokenGenerator';

describe('/user', () => {
	let app: Express;
	const mockUser = {
		id: 1,
		username: 'testUser',
		email: 'test@email.com',
		friends: 0,
		likes: 0,
		dislikes: 0,
		created_at: new Date(),
		last_online: new Date(),
		profile_picture: 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg',
	};

	beforeEach(() => {
		app = express();
		app.use(cookieParser());
		app.use(userRouter);
	});

	test('Should return user if verified token present', async () => {
		const accessToken = generateToken(mockUser, '7m');
		const refreshToken = generateToken(mockUser, '7d');

		const response = await request(app)
			.get('/user')
			.set('Cookie', `accessToken=${accessToken}`)
			.set('Cookie', `refreshToken=${refreshToken}`);

		expect(response.status).toBe(201);
		expect(response.body.username).toBe('testUser');
		expect(response.body.id).toBe(1);
	});

	test('Should generate new access token if expired', async () => {
		const expiredAccessToken = generateToken(mockUser, '1ms');
		const refreshToken = generateToken(mockUser, '7d');

		const response = await request(app)
			.get('/user')
			.set('Cookie', `accessToken=${expiredAccessToken}`)
			.set('Cookie', `refreshToken=${refreshToken}`);

		expect(response.status).toBe(201);
		expect(response.body.username).toBe('testUser');
		expect(response.body.id).toBe(1);
	});

	test('Should return 401 if no tokens present', async () => {
		const response = await request(app)
			.get('/user');

		expect(response.status).toBe(401);
		expect(response.body).toEqual({error: 'No authorization'});
	});

	test('Should return 500 if invalid token', async () => {
		const response = await request(app)
			.get('/user')
			.set('Cookie', 'refreshToken=invalidToken');

		expect(response.status).toBe(500);
		expect(response.body.error).toBeDefined();
	});

	test('Should return 500 if refresh token expired', async () => {
		const expiredAccessToken = generateToken(mockUser, '1ms');
		const expiredRefreshToken = generateToken(mockUser, '1ms');

		const response = await request(app)
			.get('/user')
			.set('Cookie', `accessToken=${expiredAccessToken}`)
			.set('Cookie', `refreshToken=${expiredRefreshToken}`);

		expect(response.status).toBe(500);
		expect(response.body.error).toBeDefined();
	});
});
