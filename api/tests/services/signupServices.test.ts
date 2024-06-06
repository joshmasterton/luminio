/* eslint-disable @typescript-eslint/naming-convention */
import {
	describe, vi, test, type Mock,
	expect, beforeEach,
} from 'vitest';
import {signup} from '../../src/services/signupServices';
import {createUser, getUserByUsernameEmail} from '../../src/models/userModels';

vi.mock('../../src/models/userModels', () => ({
	getUserByUsernameEmail: vi.fn(),
	createUser: vi.fn(),
}));

describe('signup', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const mockUser = {
		id: 1,
		username: 'testUsr',
		email: 'testEmail@email.com',
		friends: 0,
		likes: 0,
		dislikes: 0,
		created_at: new Date(),
		last_online: new Date(),
		profile_picture: 'profile.jpg',
	};

	test('Should throw error if user already exists', async () => {
		(getUserByUsernameEmail as Mock).mockResolvedValueOnce(mockUser);
		await expect(signup('testUser', 'testEmail@email.com', 'Password', 'profile.jpg')).rejects.toThrow('User already exists');
	});

	test('Should create user if user does not exist', async () => {
		(getUserByUsernameEmail as Mock).mockResolvedValueOnce(undefined);
		(createUser as Mock).mockResolvedValueOnce(mockUser);

		const result = await signup('testUser', 'testEmail@gmail.com', 'password', 'profile.jpg');
		expect(result).toEqual(mockUser);
	});
});
