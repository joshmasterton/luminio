/* eslint-disable @typescript-eslint/naming-convention */
import {
	type ObjectCannedACL, PutObjectCommand, S3Client, type S3ClientConfig,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';

const {AWS_ACCESS_KEY, AWS_ACCESS_KEY_SECRET} = process.env;

export const uploadToS3 = async (picture: Express.Multer.File) => {
	if (AWS_ACCESS_KEY && AWS_ACCESS_KEY_SECRET) {
		try {
			const optimizedImage = await sharp(picture.buffer)
				.resize({width: 500})
				.jpeg({quality: 75, progressive: true})
				.toBuffer();

			const s3ClientConfig: S3ClientConfig = {
				region: 'eu-west-2',
				credentials: {
					accessKeyId: AWS_ACCESS_KEY,
					secretAccessKey: AWS_ACCESS_KEY_SECRET,
				},
			};

			const s3Params = {
				Bucket: 'zynqa',
				Key: picture.originalname,
				Body: optimizedImage,
				ContentType: 'jpeg',
				ACL: 'public-read' as ObjectCannedACL,
			};

			const command = new PutObjectCommand(s3Params);
			const s3Client = new S3Client(s3ClientConfig);

			await s3Client.send(command);

			return `https://zynqa.s3.eu-west-2.amazonaws.com/${picture.originalname}`;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
		}
	}
};
