/* eslint-disable @typescript-eslint/naming-convention */
import {
	describe, beforeEach, test, vi, expect, type Mock,
} from 'vitest';
import {queryDb} from '../../src/database/db';
import {getUserByUsernameEmail, createUser} from '../../src/models/userModels';

vi.mock('../../src/database/db', () => ({
	queryDb: vi.fn(),
}));

describe('getUserByUsernameEmail', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('Should return user data when a user is found', async () => {
		const mockUser = {
			id: 1,
			username: 'testUser',
			email: 'testEmail@email.com',
			friends: 0,
			likes: 0,
			dislikes: 0,
			created_at: new Date(),
			last_online: new Date(),
			profile_picture: 'profile.jpg',
		};

		(queryDb as Mock).mockResolvedValueOnce({rows: [mockUser]});

		const result = await getUserByUsernameEmail('testUser', 'testEmail@email.com');
		const expectedQuery = `
			SELECT id, username, email, friends, likes, dislikes,
			created_at, last_online, profile_picture FROM luminio_users
			WHERE username = $1 OR email = $2
		`;

		expect(queryDb).toHaveBeenCalledWith(expectedQuery, ['testUser', 'testEmail@email.com']);
		expect(result).toEqual(mockUser);
	});

	test('Should return undefined when a user not found', async () => {
		(queryDb as Mock).mockResolvedValueOnce({rows: []});

		const result = await getUserByUsernameEmail('testUser', 'testEmail@email.com');
		const expectedQuery = `
			SELECT id, username, email, friends, likes, dislikes,
			created_at, last_online, profile_picture FROM luminio_users
			WHERE username = $1 OR email = $2
		`;

		expect(queryDb).toHaveBeenCalledWith(expectedQuery, ['testUser', 'testEmail@email.com']);
		expect(result).toEqual(undefined);
	});

	test('Should throw an error when a database error occurs', async () => {
		(queryDb as Mock).mockRejectedValueOnce(new Error('Database error'));
		await expect(getUserByUsernameEmail('testUser', 'testEmail@email.com')).rejects.toThrow('Database error');
	});
});

describe('creatUser', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const mockUser = {
		id: 1,
		username: 'testUser',
		email: 'testEmail@email.com',
		friends: 0,
		likes: 0,
		dislikes: 0,
		created_at: new Date(),
		last_online: new Date(),
		profile_picture: 'profile.jpg',
	};

	test('Should return new user when user creation succesful', async () => {
		(queryDb as Mock).mockResolvedValueOnce({rows: [mockUser]});

		const expectedQuery = `
			INSERT INTO luminio_users (username, username_lower_case, email, password, profile_picture)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, username, email, friends, likes, dislikes,
			created_at, last_online, profile_picture
		`;
		const newUser = await createUser('testUser', 'testEmail@email.com', 'Password', 'profile.jpg');

		expect(queryDb).toHaveBeenCalledWith(expectedQuery, ['testUser', 'testuser', 'testEmail@email.com', 'Password', 'profile.jpg']);
		expect(newUser).toEqual(mockUser);
	});

	test('Should throw error when a database error occurs', async () => {
		(queryDb as Mock).mockRejectedValueOnce(new Error('Database error'));
		await expect(createUser('testUser', 'testEmail@email.com', 'Password', 'profile.jpg')).rejects.toThrow('Database error');
	});
});
