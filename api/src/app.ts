/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {loginRouter} from './routers/loginRouter';
import {signupRouter} from './routers/signupRouter';
import {errorMiddleware} from './middleware/errorMiddleware';
import {createTables, dropTables} from './database/db';
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

// Database initialization
dropTables()
	.then(() => {
		createTables()
			.catch(error => {
				if (error instanceof Error) {
					throw error;
				}
			});
	})
	.catch(error => {
		if (error instanceof Error) {
			throw error;
		}
	});

// Auth routes
app.use('/login', loginRouter);
app.use('/signup', signupRouter);

// Error handler
app.use(errorMiddleware);

if (NODE_ENV !== 'test') {
	app.listen(PORT, () => {
		console.log(`Listening to server on port ${PORT}`);
	});
}
