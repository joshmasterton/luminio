import express from 'express';

export const signup = express.Router();

signup.post(
	'/',
	async (_req, res) => res.status(200).json({message: 'Signup successful'}),
);
