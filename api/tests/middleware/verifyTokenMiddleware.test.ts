/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import request from 'supertest';
import {describe, expect, test} from 'vitest';
import cookieParser from 'cookie-parser';
import {verfiyTokenMiddleware} from '../../src/middleware/verifyTokenMiddleware';
import {generateToken} from '../../src/utilities/tokenGenerator';

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

describe('verifyTokenMiddlware', () => {
	const app = express();

	app.use(cookieParser());

	app.get('/test', verfiyTokenMiddleware, (_req, res) => {
		const {user} = res.locals;
		res.status(200).json(user);
	});

	test('Should verify access token and set user', async () => {
		const accessToken = generateToken(mockUser, '7m');
		const refreshToken = generateToken(mockUser, '7d');

		const response = await request(app)
			.get('/test')
			.set('Cookie', `accessToken=${accessToken}`)
			.set('Cookie', `refreshToken=${refreshToken}`);

		expect(response.status).toBe(200);
		expect(response.body.username).toEqual(mockUser.username);
		expect(response.body.id).toEqual(mockUser.id);
		expect(response.headers['set-cookie'][0]).toBeDefined();
		expect(response.headers['set-cookie'][1]).toBeDefined();
	});

	test('Should verify refresh token and set new access token aswell as user', async () => {
		const refreshToken = generateToken(mockUser, '7d');

		const response = await request(app)
			.get('/test')
			.set('Cookie', `refreshToken=${refreshToken}`);

		expect(response.status).toBe(200);
		expect(response.body.username).toEqual(mockUser.username);
		expect(response.body.id).toEqual(mockUser.id);
		expect(response.headers['set-cookie'][0]).toBeDefined();
		expect(response.headers['set-cookie'][1]).toBeDefined();
	});

	test('Should return 401 if no tokens are provided', async () => {
		const response = await request(app).get('/test');
		expect(response.status).toBe(401);
		expect(response.body).toEqual({error: 'No authorization'});
	});

	test('Should return 401 if no refresh token is provided', async () => {
		const accessToken = generateToken(mockUser, '7m');

		const response = await request(app)
			.get('/test')
			.set('Cookie', `accessToken=${accessToken}`);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({error: 'No authorization'});
	});
});
