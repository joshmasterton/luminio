import express, {type Express} from 'express';
import {
	describe, test, expect, afterEach, beforeEach,
} from 'vitest';
import request from 'supertest';
import {createUsersTable, dropUsersTable} from '../../src/database/db';
import {getUsersRouter} from '../../src/routers/usersRouters/getUsersRouter';
import {createUser} from '../../src/models/userModels';
import {generateToken} from '../../src/utilities/tokenGenerator';
import cookieParser from 'cookie-parser';

describe('/getUsers', () => {
	let app: Express;
	let tableName: string;

	beforeEach(async () => {
		tableName = `luminio_users_test_users_router_${Date.now()}`;

		await dropUsersTable(tableName);
		await createUsersTable(tableName);

		app = express();
		app.use(cookieParser());
		app.use(express.json());
		app.use(express.urlencoded({extended: false}));
		app.use(getUsersRouter(tableName));
	});

	afterEach(async () => {
		await dropUsersTable(tableName);
	});

	test('Return list of users with query params', async () => {
		const user = await createUser(tableName, 'testUserOne', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserThree', 'test1@email.com', 'Password', 'profile.jpg');

		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.get('/getUsers')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.query({
				sort: 'username',
				page: 0,
			});

		expect(response.body?.length).toBe(2);
		expect(response.body?.[0].username).toBe('testUserTwo');
	});

	test('Return list of users with query params', async () => {
		const user = await createUser(tableName, 'testUserOne', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserThree', 'test1@email.com', 'Password', 'profile.jpg');

		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.get('/getUsers')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);

		expect(response.body?.length).toBe(2);
		expect(response.body?.[0].username).toBe('testUserThree');
	});
});
