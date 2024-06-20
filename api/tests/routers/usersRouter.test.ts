import express, {type Express} from 'express';
import {
	describe, test, expect, afterEach, beforeEach,
} from 'vitest';
import request from 'supertest';
import {createUsersTable, dropUsersTable} from '../../src/database/db';
import {usersRouter} from '../../src/routers/usersRouter';
import {createUser} from '../../src/models/userModels';

describe('/users', () => {
	let app: Express;
	let tableName: string;

	beforeEach(async () => {
		tableName = `luminio_users_test_users_router_${Date.now()}`;

		await dropUsersTable(tableName);
		await createUsersTable(tableName);

		app = express();
		app.use(express.json());
		app.use(express.urlencoded({extended: false}));
		app.use(usersRouter(tableName));
	});

	afterEach(async () => {
		await dropUsersTable(tableName);
	});

	test('Return list of users with query params', async () => {
		await createUser(tableName, 'testUserOne', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserThree', 'test1@email.com', 'Password', 'profile.jpg');

		const response = await request(app)
			.get('/users')
			.query({
				sort: 'username',
				page: 0,
			});

		expect(response.body?.length).toBe(3);
		expect(response.body?.[0].username).toBe('testUserTwo');
	});

	test('Return list of users with query params', async () => {
		await createUser(tableName, 'testUserOne', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserThree', 'test1@email.com', 'Password', 'profile.jpg');

		const response = await request(app)
			.get('/users');

		expect(response.body?.length).toBe(3);
		expect(response.body?.[0].username).toBe('testUserThree');
	});
});
