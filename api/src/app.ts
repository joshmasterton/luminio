/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {login} from './routes/auth/login';
import {signup} from './routes/auth/signup';
dotenv.config({path: './src/.env'});

export const app = express();
const {PORT, CLIENT_URL} = process.env;

// Security
app.use(cors({
	credentials: true,
	origin: CLIENT_URL,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Auth routes
app.use('/login', login);
app.use('/signup', signup);

app.listen(PORT, () => {
	console.log(`Listening to server on port ${PORT}`);
});
