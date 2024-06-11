import express from 'express';
import {
	afterEach, beforeEach, describe, expect, test,
} from 'vitest';
import path from 'path';
import request from 'supertest';
import {createUsersTable, dropUsersTable} from '../../src/database/db';
import {signupRouter} from '../../src/routers/signupRouter';

const app = express();

describe('/signup', () => {
	let tableName: string;

	beforeEach(async () => {
		tableName = 'luminio_users_test_signup_router';

		await dropUsersTable(tableName);
		await createUsersTable(tableName);
	});

	afterEach(async () => {
		await dropUsersTable(tableName);
	});

	test('Should return user if signup successful', async () => {
		const router = signupRouter(tableName);
		app.use(router);

		const response = await request(app)
			.post('/signup')
			.field({
				username: 'testUser',
				email: 'test@email.com',
				password: 'Password',
				confirmPassword: 'Password',
			})
			.attach('profilePicture', path.join(__dirname, '..', './mockData/profilePictureTest.jpg'));

		expect(response.body.username).toBe('testUser');
		expect(response.body.id).toBe(1);
	});

	test('Should return error if no username', async () => {
		const router = signupRouter(tableName);
		app.use(router);

		const response = await request(app)
			.post('/signup')
			.field({
				username: '',
				email: 'test@email.com',
				password: 'Password',
				confirmPassword: 'Password',
			})
			.attach('profilePicture', path.join(__dirname, '..', './mockData/profilePictureTest.jpg'));

		expect(response.body).toEqual({error: 'Username required'});
	});

	test('Should return error if invalid email type', async () => {
		const router = signupRouter(tableName);
		app.use(router);

		const response = await request(app)
			.post('/signup')
			.field({
				username: 'testUser',
				email: 'testemail.com',
				password: 'Password',
				confirmPassword: 'Password',
			})
			.attach('profilePicture', path.join(__dirname, '..', './mockData/profilePictureTest.jpg'));

		expect(response.body).toEqual({error: 'Email required'});
	});

	test('Should return error if no password', async () => {
		const router = signupRouter(tableName);
		app.use(router);

		const response = await request(app)
			.post('/signup')
			.field({
				username: 'testUser',
				email: 'test@email.com',
				password: 'Pass',
				confirmPassword: 'Password',
			})
			.attach('profilePicture', path.join(__dirname, '..', './mockData/profilePictureTest.jpg'));

		expect(response.body).toEqual({error: 'Password must be at least 6 characters'});
	});

	test('Should return error if passwords do not match', async () => {
		const router = signupRouter(tableName);
		app.use(router);

		const response = await request(app)
			.post('/signup')
			.field({
				username: 'testUser',
				email: 'test@email.com',
				password: 'Password',
				confirmPassword: 'Passwrd',
			})
			.attach('profilePicture', path.join(__dirname, '..', './mockData/profilePictureTest.jpg'));

		expect(response.body).toEqual({error: 'Passwords must match'});
	});

	test('Should return error if no profile picture', async () => {
		const router = signupRouter(tableName);
		app.use(router);

		const response = await request(app)
			.post('/signup')
			.field({
				username: 'testUser',
				email: 'test@email.com',
				password: 'Password',
				confirmPassword: 'Password',
			});

		expect(response.body).toEqual({error: 'No profile picture selected'});
	});
});
