import path from 'path';
import fs from 'fs';
import {
	afterEach, beforeEach, describe, test, expect,
} from 'vitest';
import {createUsersTable, dropUsersTable} from '../../src/database/db';
import {signup} from '../../src/services/signupServices';

let tableName: string;
const profilePicture = path.join(__dirname, '..', './mockData/profilePictureTest.jpg');
const buffer = fs.readFileSync(profilePicture);
const mockFile = {
	fieldname: 'profilePicture',
	originalname: 'profilePictureTest.jpg',
	encoding: '7bit',
	mimetype: 'image/jpeg',
	size: buffer.length,
	buffer,
};

describe('signup', () => {
	tableName = `luminio_users_test_signup_${Date.now()}`;

	beforeEach(async () => {
		await dropUsersTable(tableName);
		await createUsersTable(tableName);
	});

	afterEach(async () => {
		await dropUsersTable(tableName);
	});

	test('Should create a new user', async () => {
		const newUser = await signup(tableName, 'testUser', 'test@email.com', 'password', mockFile as Express.Multer.File);

		expect(newUser).toBeDefined();
		expect(newUser?.id).toBe(1);
		expect(newUser?.username).toBe('testUser');
	});

	test('Should throw error if user already exists', async () => {
		await signup(tableName, 'testUser', 'test@email.com', 'password', mockFile as Express.Multer.File);
		await expect(signup(tableName, 'testUser', 'test@email.com', 'password', mockFile as Express.Multer.File))
			.rejects.toThrowError('User already exists');
	});
});
