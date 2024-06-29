import express, {type Express} from 'express';
import {
	afterEach, beforeEach, describe, expect, test,
} from 'vitest';
import {
	createFriendsTable, createUsersTable, dropFriendsTable, dropUsersTable,
} from '../../../src/database/db';
import {createUser} from '../../../src/models/userModels';
import {generateToken} from '../../../src/utilities/tokenGenerator';
import {getFriendsRouter} from '../../../src/routers/friendshipsRouters/getFriendsRouter';
import {addRemoveFriend} from '../../../src/services/friendshipsServices/addRemoveFriendServices';
import request from 'supertest';
import cookieParser from 'cookie-parser';

describe('/getFriends', async () => {
	let app: Express;
	let friendsTable: string;
	let usersTable: string;

	beforeEach(async () => {
		friendsTable = `luminio_friends_test_get_friendship_${Date.now()}`;
		usersTable = `luminio_users_test_get_friendship_${Date.now()}`;

		await dropFriendsTable(friendsTable);
		await dropUsersTable(usersTable);
		await createFriendsTable(friendsTable);
		await createUsersTable(usersTable);

		app = express();
		app.use(cookieParser());
		app.use(express.json());
		app.use(express.urlencoded({extended: false}));
		app.use(getFriendsRouter(friendsTable, usersTable));
	});

	afterEach(async () => {
		await dropFriendsTable(friendsTable);
		await dropUsersTable(usersTable);
	});

	test('Should return existing friendships', async () => {
		const user = await createUser(usersTable, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const userTwo = await createUser(usersTable, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const userThree = await createUser(usersTable, 'testUserThree', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		await addRemoveFriend(friendsTable, usersTable, 'add', user!.id, userTwo!.id);
		await addRemoveFriend(friendsTable, usersTable, 'add', userTwo!.id, user!.id);
		await addRemoveFriend(friendsTable, usersTable, 'add', userThree!.id, userTwo!.id);

		const response = await request(app)
			.get('/getFriends')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.query({
				userId: 1,
			});

		expect(response.body.length).toBe(1);
	});

	test('Should return empty if no friendships', async () => {
		const user = await createUser(usersTable, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.get('/getFriends')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.query({
				userId: 1,
			});

		expect(response.body).toEqual({error: 'No friends found'});
	});
});
