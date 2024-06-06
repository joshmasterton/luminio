import multer from 'multer';

export const multerConfig = () => multer({
	storage: multer.memoryStorage(),
	fileFilter(_req, file, cb) {
		if (file.mimetype.startsWith('image/') && !file.mimetype.endsWith('avif')) {
			cb(null, true);
		} else {
			cb(new Error('Only images are allowed'));
		}
	},
	limits: {
		fileSize: 2 * 1024 * 1024,
	},
});
