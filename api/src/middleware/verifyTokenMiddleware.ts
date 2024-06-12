import {type TokenCookies} from '../types/middleware/verifyTokenMiddleware.types';
import {type Request, type Response, type NextFunction} from 'express';
import {generateToken, verifyToken} from '../utilities/tokenGenerator';

export const verfiyTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const {accessToken, refreshToken} = req.cookies as TokenCookies;

	if (!accessToken && !refreshToken) {
		return res.status(401).json({error: 'No authorization'});
	}

	try {
		if (accessToken && refreshToken) {
			const decodedToken = verifyToken(accessToken);

			res.cookie('accessToken', accessToken, {maxAge: 7 * 60 * 1000});
			res.cookie('refreshToken', refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000});
			res.locals.user = decodedToken;
		} else if (refreshToken) {
			const decodedToken = verifyToken(refreshToken);
			const newAccessToken = generateToken(decodedToken, '7m');

			res.cookie('accessToken', newAccessToken, {maxAge: 7 * 60 * 1000});
			res.cookie('refreshToken', refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000});
			res.locals.user = decodedToken;
		} else {
			return res.status(401).json({error: 'No authorization'});
		}

		next();
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
};
