import request from 'supertest';
import express, {type Express} from 'express';
import {
	describe, test, afterEach,
	expect,
} from 'vitest';
import {beforeEach} from 'vitest';
import {
	createFriendsTable, createUsersTable, dropFriendsTable, dropUsersTable,
} from '../../src/database/db';
import {updateProfileRouter} from '../../src/routers/authRouters/updateProfileRouter';
import {createUser, getUserReturnPassword} from '../../src/models/userModels';
import {generateToken} from '../../src/utilities/tokenGenerator';
import cookieParser from 'cookie-parser';
import path from 'path';
import bcryptjs from 'bcryptjs';

describe('/updateProfile', () => {
	let app: Express;
	let tableName: string;
	let friendsTable: string;

	beforeEach(async () => {
		tableName = `luminio_users_test_update_profile_router_${Date.now()}`;
		friendsTable = `luminio_friends_test_update_profile_router_${Date.now()}`;

		await dropUsersTable(tableName);
		await dropFriendsTable(friendsTable);
		await createUsersTable(tableName);
		await createFriendsTable(friendsTable);

		app = express();
		app.use(express.json());
		app.use(cookieParser());
		app.use(express.urlencoded({extended: false}));
		app.use(updateProfileRouter(tableName));
	});

	afterEach(async () => {
		await dropUsersTable(tableName);
		await dropFriendsTable(friendsTable);
	});

	test('Should update user details on success', async () => {
		const user = await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.put('/updateProfile')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.field({
				username: 'newUsername',
				password: 'newPassword',
				confirmPassword: 'newPassword',
			})
			.attach('profilePicture', path.join(__dirname, '..', './mockData/profilePictureTest2.jpg'));

		const updatedPassword = (await getUserReturnPassword(tableName, 'username', user?.username));
		if (updatedPassword) {
			const comparePassword = await bcryptjs.compare('newPassword', updatedPassword);
			expect(comparePassword).toBeTruthy();
		}

		expect(response.body.username).toBe('newUsername');
		expect(response.body.profile_picture).toBe('https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest2.jpg');
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

	test('Should throw error in no username, profile picture or passoword', async () => {
		const user = await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.put('/updateProfile')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);

		expect(response.body).toEqual({error: 'Nothing to update user with'});
	});

	test('Should throw error in passwords do not match', async () => {
		const user = await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.put('/updateProfile')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.field({
				password: 'newPassword',
			});

		expect(response.body).toEqual({error: 'Passwords must match'});
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

		const updatedPassword = (await getUserReturnPassword(tableName, 'username', user?.username))!;
		const comparePassword = await bcryptjs.compare('Password', updatedPassword);

		expect(response.body.username).toBe('testUser');
		expect(comparePassword).toBeTruthy();
		expect(response.body.profile_picture).toBe('https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest2.jpg');
	});

	test('Should update just password', async () => {
		const user = await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.put('/updateProfile')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.field({
				password: 'newPassword',
				confirmPassword: 'newPassword',
			});

		const updatedPassword = (await getUserReturnPassword(tableName, 'username', user?.username))!;
		const comparePassword = await bcryptjs.compare('newPassword', updatedPassword);

		expect(response.body.username).toBe('testUser');
		expect(comparePassword).toBeTruthy();
		expect(response.body.profile_picture).toBe('profile.jpg');
	});
});
