import {getUser, updateUser} from '../models/userModels';
import {uploadToS3} from '../utilities/uploadToS3';

export const updateProfile = async (
	tableName: string,
	oldUsername: string,
	username?: string,
	password?: string,
	profilePicture?: Express.Multer.File,
) => {
	try {
		const existingUser = await getUser(tableName, 'username_lower_case', username?.toLowerCase());
		if (existingUser) {
			throw new Error('Username already taken');
		}

		if (!username && !profilePicture && !password) {
			throw new Error('Nothing to update user with');
		}

		if (profilePicture) {
			const uploadedPicture = await uploadToS3(profilePicture);

			if (uploadedPicture) {
				const updatedUser = await updateUser(tableName, oldUsername, username, password, uploadedPicture);
				return updatedUser;
			}

			throw new Error('Error uploading image');
		}

		const updatedUser = await updateUser(tableName, oldUsername, username, password, undefined);
		return updatedUser;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
