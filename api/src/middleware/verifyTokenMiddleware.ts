import {type TokenCookies} from '../types/middleware/verifyTokenMiddleware.types';
import {type Request, type Response, type NextFunction} from 'express';
import {generateToken, verifyToken} from '../utilities/tokenGenerator';

export const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const {accessToken, refreshToken} = req.cookies as TokenCookies;

	if (!refreshToken) {
		return res.status(401).json({error: 'No authorization'});
	}

	try {
		if (accessToken) {
			const decodedAccessToken = verifyToken(accessToken);

			if (req.path !== '/logout') {
				res.cookie('accessToken', accessToken, {maxAge: 8 * 60 * 1000, httpOnly: true});
				res.cookie('refreshToken', refreshToken, {maxAge: 8 * 24 * 60 * 60 * 1000, httpOnly: true});
			}

			res.locals.user = decodedAccessToken;
			next();
			return;
		}

		throw new Error('AccessTokenMissing');
	} catch (accessTokenError) {
		if (accessTokenError instanceof Error && accessTokenError.name !== 'TokenExpiredError' && accessTokenError.message !== 'AccessTokenMissing') {
			return res.status(401).json({error: 'No authorization'});
		}

		try {
			const decodedRefreshToken = verifyToken(refreshToken);
			const newAccessToken = generateToken(decodedRefreshToken, '7m');

			if (req.path !== '/logout') {
				res.cookie('accessToken', newAccessToken, {maxAge: 8 * 60 * 1000, httpOnly: true});
				res.cookie('refreshToken', refreshToken, {maxAge: 8 * 24 * 60 * 60 * 1000, httpOnly: true});
			}

			res.locals.user = decodedRefreshToken;
			next();
		} catch (refreshTokenError) {
			return res.status(401).json({error: 'No authorization'});
		}
	}
};
