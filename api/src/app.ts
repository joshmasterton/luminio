/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {loginRouter} from './routers/loginRouter';
import {signupRouter} from './routers/signupRouter';
import {errorMiddleware} from './middleware/errorMiddleware';
import {createFriendsTable, createUsersTable} from './database/db';
import {userRouter} from './routers/userRouter';
import {logoutRouter} from './routers/logoutRouter';
import {profileRouter} from './routers/profileRouter';
import {updateProfileRouter} from './routers/updateProfileRouter';
import {getUsersRouter} from './routers/getUsersRouter';
import {addRemoveFriendRouter} from './routers/addRemoveFriendRouter';
import {getFriendshipRouter} from './routers/getFriendshipRouter';
dotenv.config({path: './src/.env'});

export const app = express();
const {PORT, CLIENT_URL, NODE_ENV} = process.env;

// Security
app.use(cors({
	credentials: true,
	origin: CLIENT_URL,
}));

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Database initializtion
createUsersTable('luminio_users')
	.then(() => {
		createFriendsTable('luminio_friendships')
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
app.use(loginRouter('luminio_users'));
app.use(signupRouter('luminio_users'));
app.use(profileRouter('luminio_users'));
app.use(updateProfileRouter('luminio_users'));
app.use(getUsersRouter('luminio_users'));
app.use(addRemoveFriendRouter('luminio_friendships', 'luminio_users'));
app.use(getFriendshipRouter('luminio_friendships'));
app.use(userRouter);
app.use(logoutRouter);

// Error handler
app.use(errorMiddleware);

if (NODE_ENV !== 'test') {
	app.listen(PORT, () => {
		console.log(`Listening to server on port ${PORT}`);
	});
}
