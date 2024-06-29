import express, {type Express} from 'express';
import {
	afterEach, beforeEach, describe, expect, test,
} from 'vitest';
import {
	createFriendsTable, createUsersTable, dropFriendsTable, dropUsersTable,
} from '../../../src/database/db';
import {getFriendshipRouter} from '../../../src/routers/friendshipsRouters/getFriendshipRouter';
import {createUser} from '../../../src/models/userModels';
import {generateToken} from '../../../src/utilities/tokenGenerator';
import {addFriend} from '../../../src/models/friendModels';
import request from 'supertest';
import cookieParser from 'cookie-parser';

describe('/getFriendship', async () => {
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
		app.use(getFriendshipRouter(friendsTable));
	});

	afterEach(async () => {
		await dropFriendsTable(friendsTable);
		await dropUsersTable(usersTable);
	});

	test('Should return existing friendship', async () => {
		const user = await createUser(usersTable, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const userTwo = await createUser(usersTable, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		await addFriend(friendsTable, user!.id, userTwo!.id);

		const response = await request(app)
			.get('/getFriendship')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.query({
				friendId: userTwo?.id,
			});

		expect(response.body.id).toBe(1);
		expect(response.body.friend_one_id).toBe(user?.id);
		expect(response.body.friend_two_id).toBe(userTwo?.id);
	});

	test('Should return empty if no friendship', async () => {
		const user = await createUser(usersTable, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.get('/getFriendship')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.query({
				friendId: user?.id,
			});

		expect(response.body).toEqual({});
	});
});
