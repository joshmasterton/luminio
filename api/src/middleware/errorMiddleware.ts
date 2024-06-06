import {
	type Request, type Response, type NextFunction,
} from 'express';

export const errorMiddleware = (
	error: Error, _req: Request, res: Response, next: NextFunction,
) => {
	if (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}

	next();
};
