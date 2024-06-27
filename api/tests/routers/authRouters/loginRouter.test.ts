import express, {type Express} from 'express';
import request from 'supertest';
import {
	afterEach, beforeEach, describe, expect, test,
} from 'vitest';
import {createUsersTable, dropUsersTable} from '../../../src/database/db';
import {loginRouter} from '../../../src/routers/authRouters/loginRouter';
import {createUser} from '../../../src/models/userModels';

describe('/login', () => {
	let app: Express;
	let tableName: string;

	beforeEach(async () => {
		tableName = `luminio_users_test_login_router_${Date.now()}`;

		await dropUsersTable(tableName);
		await createUsersTable(tableName);

		app = express();
		app.use(express.json());
		app.use(express.urlencoded({extended: false}));
		app.use(loginRouter(tableName));
	});

	afterEach(async () => {
		await dropUsersTable(tableName);
	});

	test('Should return user if login succesful', async () => {
		await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');

		const response = await request(app)
			.post('/login')
			.send({
				username: 'testUser',
				password: 'Password',
			});

		expect(response.body.username).toBe('testUser');
		expect(response.body.id).toBe(1);
	});

	test('Show throw error is no user present', async () => {
		const response = await request(app)
			.post('/login')
			.send({
				username: 'testUser',
				password: 'Password',
			});

		expect(response.body).toEqual({error: 'No user details found'});
	});

	test('Show throw error is password is incorrect', async () => {
		await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');

		const response = await request(app)
			.post('/login')
			.send({
				username: 'testUser',
				password: 'password',
			});

		expect(response.body).toEqual({error: 'No user details found'});
	});
});
