import {describe, expect, test} from 'vitest';
import {createUser, getUser, getUsers} from '../../src/models/userModels';

describe('getUser', () => {
	test('Should return user when there is a user by id', async () => {
		await createUser('testUser', 'testEmail@email.com', 'Password', 'profile.jpg');
		const existingUser = await getUser('id', '1');

		expect(existingUser).toBeDefined();
		expect(existingUser?.username).toBe('testUser');
		expect(existingUser?.email).toBe('testEmail@email.com');
	});

	test('Should return undefined if no user present', async () => {
		const existingUser = await getUser('username', 'testUser');
		expect(existingUser).toBeUndefined();
	});
});

describe('getUsers', () => {
	test('Should return users with pagination and sorting', async () => {
		await createUser('testUser1', 'testEmail@email.com', 'Password', 'profile.jpg');
		await createUser('testUser2', 'testEmail@email.com', 'Password', 'profile.jpg');
		await createUser('testUser3', 'testEmail@email.com', 'Password', 'profile.jpg');

		const usersPageOne = await getUsers('created_at', 0, 2);

		expect(usersPageOne).toHaveLength(2);
		expect(usersPageOne?.[0]?.username).toBe('testUser3');

		const usersPageTwo = await getUsers('created_at', 2, 2);

		expect(usersPageTwo).toHaveLength(1);
		expect(usersPageTwo?.[0]?.username).toBe('testUser1');
	});
});

describe('createUser', () => {
	test('Should insert a new user into the database', async () => {
		const user = await createUser('testUser', 'testEmail@email.com', 'Password', 'profile.jpg');
		expect(user).toBeDefined();
		expect(user?.username).toBe('testUser');
		expect(user?.email).toBe('testEmail@email.com');
	});
});

