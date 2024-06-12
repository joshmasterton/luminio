/* eslint-disable @typescript-eslint/naming-convention */
import {describe, expect, test} from 'vitest';
import {generateToken, verifyToken} from '../../src/utilities/tokenGenerator';

const mockUser = {
	id: 1,
	username: 'testUser',
	email: 'test@email.com',
	friends: 0,
	likes: 0,
	dislikes: 0,
	created_at: new Date(),
	last_online: new Date(),
	profile_picture: 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg',
};

describe('Token generation', () => {
	test('Should generate valid access and refresh token', () => {
		const accessToken = generateToken(mockUser, '7m');
		const refreshToken = generateToken(mockUser, '7d');

		expect(accessToken).toBeDefined();
		expect(refreshToken).toBeDefined();
	});
});

describe('Token verification', () => {
	test('Should return decoded token if signed token secure', () => {
		const accessToken = generateToken(mockUser, '7m');
		const decodedToken = verifyToken(accessToken);

		expect(decodedToken.username).toEqual(mockUser.username);
		expect(decodedToken.id).toEqual(mockUser.id);
	});
});
