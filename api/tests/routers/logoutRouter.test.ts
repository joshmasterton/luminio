/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import {describe, expect, test} from 'vitest';
import request from 'supertest';
import {generateToken} from '../../src/utilities/tokenGenerator';
import {logoutRouter} from '../../src/routers/logoutRouter';
import cookieParser from 'cookie-parser';

describe('/logout', () => {
	const app = express();
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

	app.use(cookieParser());
	app.use(logoutRouter);

	test('Should return 200 after successfully clearing cookies', async () => {
		const accessToken = generateToken(mockUser, '7m');
		const refreshToken = generateToken(mockUser, '7d');

		const response = await request(app)
			.post('/logout')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({message: 'Logged out successfully'});
		expect(response.headers['set-cookie'][0]).toMatch(/accessToken=; Path=\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT/);
		expect(response.headers['set-cookie'][1]).toMatch(/refreshToken=; Path=\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT/);
	});
});
