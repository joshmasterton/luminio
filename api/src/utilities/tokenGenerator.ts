/* eslint-disable @typescript-eslint/naming-convention */
import {type User} from '../types/models/userModels.types';
import JWT, {type JwtPayload} from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({path: './src/.env'});

const {JWT_SECRET} = process.env;

export const generateToken = (user: User, expiresIn: string) => {
	if (!JWT_SECRET) {
		throw new Error('Invalid JWT_SECRET');
	}

	return JWT.sign(user, JWT_SECRET, {expiresIn});
};

export const verifyToken = (token: string) => {
	if (!JWT_SECRET) {
		throw new Error('Invalid JWT_SECRET');
	}

	const verifyToken = JWT.verify(token, JWT_SECRET) as JwtPayload;
	const {iat, exp, ...decodedToken} = verifyToken;

	return decodedToken as User;
};
