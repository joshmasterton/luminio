import {createPost} from '../../models/postModels';
import {uploadToS3} from '../../utilities/uploadToS3';

export const createPostService = async (tableName: string, userId: number, post: string, postPicture?: Express.Multer.File) => {
	try {
		if (postPicture) {
			const uploadedPicture = await uploadToS3(postPicture);
			if (uploadedPicture) {
				await createPost(tableName, userId, post, uploadedPicture);
			} else {
				throw new Error('Uploaded picture error');
			}
		} else {
			await createPost(tableName, userId, post, undefined);
		}
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
