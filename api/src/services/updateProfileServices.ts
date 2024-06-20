import {getUser, updateUser} from '../models/userModels';
import {uploadToS3} from '../utilities/uploadToS3';

export const updateProfile = async (
	tableName: string,
	oldUsername: string,
	username?: string,
	profilePicture?: Express.Multer.File,
) => {
	try {
		if (username && profilePicture) {
			const existingUser = await getUser(tableName, 'username_lower_case', username.toLowerCase());
			if (existingUser) {
				throw new Error('Username already taken');
			}

			const uploadedPicture = await uploadToS3(profilePicture);

			if (uploadedPicture) {
				const updatedUser = await updateUser(tableName, oldUsername, username, uploadedPicture);
				return updatedUser;
			}
		}

		if (username) {
			const existingUser = await getUser(tableName, 'username_lower_case', username.toLowerCase());
			if (existingUser) {
				throw new Error('Username already taken');
			}

			const updatedUser = await updateUser(tableName, oldUsername, username);
			return updatedUser;
		}

		if (profilePicture) {
			const uploadedPicture = await uploadToS3(profilePicture);

			if (uploadedPicture) {
				const updatedUser = await updateUser(tableName, oldUsername, undefined, uploadedPicture);
				return updatedUser;
			}
		}

		throw new Error('Nothing to update user with');
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
