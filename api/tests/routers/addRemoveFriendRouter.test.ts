import cookieParser from 'cookie-parser';
import express, {type Express} from 'express';
import {
	afterEach, beforeEach, describe, expect, test,
} from 'vitest';
import {addRemoveFriendRouter} from '../../src/routers/friendshipsRouters/addRemoveFriendRouter';
import {
	createFriendsTable, createUsersTable, dropFriendsTable, dropUsersTable,
} from '../../src/database/db';
import {createUser} from '../../src/models/userModels';
import {generateToken} from '../../src/utilities/tokenGenerator';
import {addFriend} from '../../src/models/friendModels';
import request from 'supertest';

describe('/addRemoveFriend', () => {
	let app: Express;
	let tableName: string;
	let tableUsersName: string;

	beforeEach(async () => {
		tableName = `luminio_friends_test_add_remove_friend_${Date.now()}`;
		tableUsersName = `luminio_users_test_add_remove_friend_${Date.now()}`;

		await dropFriendsTable(tableName);
		await dropUsersTable(tableUsersName);
		await createFriendsTable(tableName);
		await createUsersTable(tableUsersName);

		app = express();
		app.use(express.json());
		app.use(cookieParser());
		app.use(express.urlencoded({extended: false}));
		app.use(addRemoveFriendRouter(tableName, tableUsersName));
	});

	afterEach(async () => {
		await dropFriendsTable(tableName);
		await dropUsersTable(tableUsersName);
	});

	test('Successful friendship request', async () => {
		const user = await createUser(tableUsersName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const userTwo = await createUser(tableUsersName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.post('/addRemoveFriend')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.send({
				type: 'add',
				friendId: userTwo?.id,
			});

		expect(response.status).toBe(200);
	});

	test('Should throw error if friend request already exists from initiator', async () => {
		const user = await createUser(tableUsersName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const userTwo = await createUser(tableUsersName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		await addFriend(tableName, user!.id, userTwo!.id);
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.post('/addRemoveFriend')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.send({
				type: 'add',
				friendId: userTwo?.id,
			});

		expect(response.status).toBe(500);
		expect(response.body).toEqual({error: 'Friendship request already sent'});
	});

	test('Should update friendship if non friend initiator accepts', async () => {
		const user = await createUser(tableUsersName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const userTwo = await createUser(tableUsersName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		await addFriend(tableName, userTwo!.id, user!.id);
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.post('/addRemoveFriend')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.send({
				type: 'add',
				friendId: userTwo?.id,
			});

		expect(response.status).toBe(200);
		expect(response.body.friendship_accepted).toBeTruthy();
	});

	test('Should throw an error if no friend to remove', async () => {
		const user = await createUser(tableUsersName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableUsersName, 'testUserTwo', 'test1@email.com', 'Password', 'profile.jpg');
		const accessToken = generateToken(user!, '1m');
		const refreshToken = generateToken(user!, '7m');

		const response = await request(app)
			.post('/addRemoveFriend')
			.set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
			.send({
				type: 'remove',
				friendId: user?.id,
			});

		expect(response.status).toBe(500);
	});
});
