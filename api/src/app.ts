/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {signupRouter} from './routers/signupRouter';
import {errorMiddleware} from './middleware/errorMiddleware';
import {createUsersTable, dropUsersTable} from './database/db';
dotenv.config({path: './src/.env'});

export const app = express();
const {PORT, CLIENT_URL, NODE_ENV} = process.env;

// Security
app.use(cors({
	credentials: true,
	origin: CLIENT_URL,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Database initializtion
dropUsersTable('luminio_users')
	.then(() => {
		createUsersTable('luminio_users')
			.catch(error => {
				if (error instanceof Error) {
					console.error(error.message);
				}
			});
	})
	.catch(error => {
		if (error instanceof Error) {
			console.error(error.message);
		}
	});

// Auth routes
app.use(signupRouter('luminio_users'));

// Error handler
app.use(errorMiddleware);

if (NODE_ENV !== 'test') {
	app.listen(PORT, () => {
		console.log(`Listening to server on port ${PORT}`);
	});
}
