import {createUser, getUserByUsernameEmail} from '../models/userModels';
import bcryptjs from 'bcryptjs';

export const signup = async (username: string, email: string, password: string, profilePicture: string) => {
	try {
		const existingUser = await getUserByUsernameEmail(username, email);
		if (existingUser) {
			throw new Error('User already exists');
		}

		const hashedPassword = await bcryptjs.hash(password, 10);

		const newUser = await createUser(username, email, hashedPassword, profilePicture);
		return newUser;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
