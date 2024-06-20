import express, {type Express} from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import {
	describe, test, beforeEach, expect,
	afterEach,
} from 'vitest';
import {profileRouter} from '../../src/routers/profileRouter';
import {createUsersTable, dropUsersTable} from '../../src/database/db';
import {createUser} from '../../src/models/userModels';
import {generateToken} from '../../src/utilities/tokenGenerator';

describe('/profile', () => {
	let app: Express;
	let tableName: string;

	beforeEach(async () => {
		tableName = `luminio_users_test_profile_router_${Date.now()}`;

		await dropUsersTable(tableName);
		await createUsersTable(tableName);

		app = express();
		app.use(express.json());
		app.use(express.urlencoded({extended: false}));
		app.use(cookieParser());
		app.use(profileRouter(tableName));
	});

	afterEach(async () => {
		await dropUsersTable(tableName);
	});

	test('Should return profile of user on success', async () => {
		const user = await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.get('/profile')
			.query({username: 'testUserTwo'})
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);

		expect(response.body.username).toEqual('testUserTwo');
		expect(response.body.id).toEqual(2);
	});

	test('Should return error if no user found', async () => {
		const user = await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.get('/profile')
			.query({username: 'testUserThree'})
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);

		expect(response.body).toEqual({error: 'No user found'});
	});

	test('Should return error if query sent in request', async () => {
		const user = await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.get('/profile')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);

		expect(response.body).toEqual({error: 'No user found'});
	});
});
