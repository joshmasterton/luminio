import {afterEach, beforeEach, expect} from 'vitest';
import {createUsersTable, dropUsersTable} from '../../src/database/db';
import {describe, test} from 'vitest';
import {createUser, getUser, getUsers} from '../../src/models/userModels';

describe('createUser', () => {
	let tableName: string;

	beforeEach(async () => {
		tableName = `luminio_users_test_create_user_${Date.now()}`;

		await dropUsersTable(tableName);
		await createUsersTable(tableName);
	});

	afterEach(async () => {
		await dropUsersTable(tableName);
	});

	test('Should create a user and return it', async () => {
		const user = await createUser(tableName, 'testUser', 'test@email.com', 'Password', 'profile.jpg');

		expect(user).toBeDefined();
		expect(user?.id).toBe(1);
		expect(user?.username).toBe('testUser');
	});
});

describe('getUser', () => {
	let tableName: string;

	beforeEach(async () => {
		tableName = 'luminio_users_test_get_user';

		await dropUsersTable(tableName);
		await createUsersTable(tableName);
	});

	afterEach(async () => {
		await dropUsersTable(tableName);
	});

	test('Should return user if found', async () => {
		await createUser(tableName, 'testUser', 'test@email.com', 'Password', 'profile.jpg');

		const user = await getUser(tableName, 'id', 1);

		expect(user).toBeDefined();
		expect(user?.id).toBe(1);
		expect(user?.username).toBe('testUser');
	});

	test('Should return undefined if no user present', async () => {
		const user = await getUser(tableName, 'id', 1);
		expect(user).toBeUndefined();
	});
});

describe('getUsers', () => {
	let tableName: string;

	beforeEach(async () => {
		tableName = 'luminio_users_test_get_users';

		await dropUsersTable(tableName);
		await createUsersTable(tableName);
	});

	afterEach(async () => {
		await dropUsersTable(tableName);
	});

	test('Should return users with correct sorting, pagination and limit', async () => {
		await createUser(tableName, 'testUser1', 'test1@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUser2', 'test2@email.com', 'Password', 'profile.jpg');
		await createUser(tableName, 'testUser3', 'test3@email.com', 'Password', 'profile.jpg');

		const usersPageOne = await getUsers(tableName, 'created_at', 0, 2);
		expect(usersPageOne?.length).toBe(2);
		expect(usersPageOne?.[0].username).toBe('testUser3');

		const usersPageTwo = await getUsers(tableName, 'created_at', 2, 2);
		expect(usersPageTwo?.length).toBe(1);
		expect(usersPageTwo?.[0].username).toBe('testUser1');
	});
});