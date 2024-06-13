import {type TokenCookies} from '../types/middleware/verifyTokenMiddleware.types';
import {type Request, type Response, type NextFunction} from 'express';
import {generateToken, verifyToken} from '../utilities/tokenGenerator';

export const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const {accessToken, refreshToken} = req.cookies as TokenCookies;

	if (!accessToken || !refreshToken) {
		return res.status(401).json({error: 'No authorization'});
	}

	try {
		// Verify the access token first
		const decodedAccessToken = verifyToken(accessToken);

		// If access token is valid, refresh the tokens
		if (req.path !== '/logout') {
			res.cookie('accessToken', accessToken, {maxAge: 7 * 60 * 1000});
			res.cookie('refreshToken', refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000});
		}

		res.locals.user = decodedAccessToken;
		next();
	} catch (accessTokenError) {
		if (accessTokenError instanceof Error && accessTokenError.name !== 'TokenExpiredError') {
			return res.status(401).json({error: 'No authorization'});
		}

		// If access token is expired, verify the refresh token
		try {
			const decodedRefreshToken = verifyToken(refreshToken);
			const newAccessToken = generateToken(decodedRefreshToken, '7m');

			if (req.path !== '/logout') {
				res.cookie('accessToken', newAccessToken, {maxAge: 7 * 60 * 1000});
				res.cookie('refreshToken', refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000});
			}

			res.locals.user = decodedRefreshToken;
			next();
		} catch (refreshTokenError) {
			return res.status(401).json({error: 'No authorization'});
		}
	}
};
