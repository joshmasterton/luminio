import {type Request, type Response, type NextFunction} from 'express';
import {validationResult} from 'express-validator';

export const validatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorMessage = errors.array()[0].msg as string;
		return res.status(400).json({error: errorMessage});
	}

	next();
};
