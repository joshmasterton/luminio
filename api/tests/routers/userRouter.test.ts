import cookieParser from 'cookie-parser';
import request from 'supertest';
import express, {type Express} from 'express';
import {
	beforeEach, describe, expect, test,
} from 'vitest';
import {userRouter} from '../../src/routers/userRouter';
import {generateToken} from '../../src/utilities/tokenGenerator';
import {mockUser} from '../mockData/mockUser';

describe('/user', () => {
	let app: Express;
	beforeEach(() => {
		app = express();
		app.use(cookieParser());
		app.use(userRouter);
	});

	test('Should return user if verified tokens are present', async () => {
		const accessToken = generateToken(mockUser, '7m');
		const refreshToken = generateToken(mockUser, '7d');

		const response = await request(app)
			.get('/user')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);

		expect(response.status).toBe(201);
		expect(response.body.username).toBe('testUser');
		expect(response.body.id).toBe(1);
		expect(response.headers['set-cookie']).toBeDefined();
	});

	test('Should generate new access token if expired', async () => {
		const expiredAccessToken = generateToken(mockUser, '1ms');
		const refreshToken = generateToken(mockUser, '7d');

		const response = await request(app)
			.get('/user')
			.set('Cookie', [`accessToken=${expiredAccessToken}`, `refreshToken=${refreshToken}`]);

		expect(response.status).toBe(201);
		expect(response.body.username).toBe('testUser');
		expect(response.body.id).toBe(1);
		expect(response.headers['set-cookie'][0]).toBeDefined();
		expect(response.headers['set-cookie'][1]).toBeDefined();
	});

	test('Should generate new access token if missing', async () => {
		const refreshToken = generateToken(mockUser, '7d');

		const response = await request(app)
			.get('/user')
			.set('Cookie', `refreshToken=${refreshToken}`);

		expect(response.status).toBe(201);
		expect(response.body.username).toBe('testUser');
		expect(response.body.id).toBe(1);
		expect(response.headers['set-cookie'][0]).toBeDefined();
		expect(response.headers['set-cookie'][1]).toBeDefined();
	});

	test('Should return 401 if no tokens present', async () => {
		const response = await request(app).get('/user');

		expect(response.status).toBe(401);
		expect(response.body).toEqual({error: 'No authorization'});
	});

	test('Should return 401 if only access token is present', async () => {
		const accessToken = generateToken(mockUser, '7m');

		const response = await request(app)
			.get('/user')
			.set('Cookie', `accessToken=${accessToken}`);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({error: 'No authorization'});
	});

	test('Should return user and set new access token if only refresh token is present', async () => {
		const refreshToken = generateToken(mockUser, '7d');

		const response = await request(app)
			.get('/user')
			.set('Cookie', `refreshToken=${refreshToken}`);

		expect(response.status).toBe(201);
		expect(response.body.username).toBe('testUser');
		expect(response.body.id).toBe(1);
		expect(response.headers['set-cookie'][0]).toBeDefined();
		expect(response.headers['set-cookie'][1]).toBeDefined();
	});

	test('Should return 401 if invalid token is provided', async () => {
		const response = await request(app)
			.get('/user')
			.set('Cookie', 'refreshToken=invalidToken')
			.set('Cookie', 'accessToken=invalidToken');

		expect(response.status).toBe(401);
		expect(response.body.error).toBeDefined();
	});

	test('Should return 401 if refresh token expired', async () => {
		const expiredAccessToken = generateToken(mockUser, '1ms');
		const expiredRefreshToken = generateToken(mockUser, '1ms');

		const response = await request(app)
			.get('/user')
			.set('Cookie', [`accessToken=${expiredAccessToken}`, `refreshToken=${expiredRefreshToken}`]);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({error: 'No authorization'});
	});
});
