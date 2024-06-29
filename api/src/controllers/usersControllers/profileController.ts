import {type Request, type Response} from 'express';
import {getUser} from '../../models/userModels';

export const profileController = async (tableName: string, req: Request, res: Response) => {
	try {
		const {userId} = req.query as unknown as {userId: number};

		if (!userId) {
			return res.status(400).json({error: 'No user id'});
		}

		const profile = await getUser(tableName, 'id', userId);

		if (!profile) {
			throw new Error('No user found');
		}

		return res.status(200).json(profile);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
