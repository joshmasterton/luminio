import request from 'supertest';
import express, {type Express} from 'express';
import {
	describe, test, afterEach,
	expect,
} from 'vitest';
import {beforeEach} from 'vitest';
import {createUsersTable, dropUsersTable} from '../../src/database/db';
import {updateProfileRouter} from '../../src/routers/updateProfileRouter';
import {createUser} from '../../src/models/userModels';
import {generateToken} from '../../src/utilities/tokenGenerator';
import cookieParser from 'cookie-parser';
import path from 'path';

describe('/updateProfile', () => {
	let app: Express;
	let tableName: string;

	beforeEach(async () => {
		tableName = `luminio_users_test_update_profile_router_${Date.now()}`;

		await dropUsersTable(tableName);
		await createUsersTable(tableName);

		app = express();
		app.use(express.json());
		app.use(cookieParser());
		app.use(express.urlencoded({extended: false}));
		app.use(updateProfileRouter(tableName));
	});

	afterEach(async () => {
		await dropUsersTable(tableName);
	});

	test('Should update user details on success', async () => {
		const user = await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.put('/updateProfile')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.field({
				username: 'testUserNew',
			})
			.attach('profilePicture', path.join(__dirname, '..', './mockData/profilePictureTest2.jpg'));

		expect(response.body.username).toBe('testUserNew');
	});

	test('Should throw error if username already taken', async () => {
		const user = await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.put('/updateProfile')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.field({
				username: 'testUserTwo',
			})
			.attach('profilePicture', path.join(__dirname, '..', './mockData/profilePictureTest2.jpg'));

		expect(response.body).toEqual({error: 'Username already taken'});
	});

	test('Should throw error in no username or profile picture provided', async () => {
		const user = await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.put('/updateProfile')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);

		expect(response.body).toEqual({error: 'Nothing to update user with'});
	});

	test('Should update just username', async () => {
		const user = await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.put('/updateProfile')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.field({
				username: 'newUsername',
			});

		expect(response.body.username).toBe('newUsername');
		expect(response.body.profile_picture).toBe('profile.jpg');
	});

	test('Should update just profile picture', async () => {
		const user = await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.put('/updateProfile')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.attach('profilePicture', path.join(__dirname, '..', './mockData/profilePictureTest2.jpg'));

		expect(response.body.username).toBe('testUser');
		expect(response.body.profile_picture).toBe('https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest2.jpg');
	});
});
