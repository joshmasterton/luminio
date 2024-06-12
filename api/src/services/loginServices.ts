import {getUser, getUserReturnPassword} from '../models/userModels';
import bcryptjs from 'bcryptjs';

export const login = async (
	tableName: string,
	username: string,
	password: string,
) => {
	try {
		const existingUserPassword = await getUserReturnPassword(tableName, 'username', username);
		if (!existingUserPassword) {
			throw new Error('No user details found');
		}

		const hashedPassword = await bcryptjs.compare(password, existingUserPassword);

		if (!hashedPassword) {
			throw new Error('No user details found');
		}

		const user = await getUser(tableName, 'username', username);

		return user;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

