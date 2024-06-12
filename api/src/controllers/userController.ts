import {type Request, type Response} from 'express';

export const userController = async (_req: Request, res: Response) => {
	try {
		const {user} = res.locals;

		if (user) {
			return res.status(201).json(user);
		}

		return res.status(401).json({error: 'No authorization'});
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
