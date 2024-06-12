import {
	afterEach, beforeEach, describe, test, expect,
} from 'vitest';
import {createUsersTable, dropUsersTable} from '../../src/database/db';
import {createUser} from '../../src/models/userModels';
import {login} from '../../src/services/loginServices';

let tableName: string;

describe('login', () => {
	tableName = `luminio_users_test_login_${Date.now()}`;

	beforeEach(async () => {
		await dropUsersTable(tableName);
		await createUsersTable(tableName);
	});

	afterEach(async () => {
		await dropUsersTable(tableName);
	});

	test('Should return a user if found', async () => {
		await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');
		const user = await login(tableName, 'testUser', 'Password');

		expect(user).toBeDefined();
		expect(user?.id).toBe(1);
		expect(user?.username).toBe('testUser');
	});

	test('Should throw error if user doesnt exist', async () => {
		await expect(login(tableName, 'testUser', 'password'))
			.rejects.toThrowError('No user details found');
	});

	test('Should throw error if user password is incorrect', async () => {
		await createUser(tableName, 'testUser', 'test1@email.com', 'Password', 'profile.jpg');

		await expect(login(tableName, 'testUser', 'password'))
			.rejects.toThrowError('No user details found');
	});
});
