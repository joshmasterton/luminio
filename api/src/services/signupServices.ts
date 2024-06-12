import {createUser, getUser} from '../models/userModels';
import {uploadToS3} from '../utilities/uploadToS3';

export const signup = async (
	tableName: string,
	username: string,
	email: string,
	password: string,
	profilePicture: Express.Multer.File,
) => {
	try {
		const existingUser = await getUser(tableName, 'username_lower_case', username.toLowerCase());
		if (existingUser) {
			throw new Error('User already exists');
		}

		const uploadedPicture = await uploadToS3(profilePicture);

		if (uploadedPicture) {
			const newUser = await createUser(tableName, username, email, password, uploadedPicture);
			return newUser;
		}
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

