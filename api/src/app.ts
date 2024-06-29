/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {loginRouter} from './routers/authRouters/loginRouter';
import {signupRouter} from './routers/authRouters/signupRouter';
import {errorMiddleware} from './middleware/errorMiddleware';
import {createFriendsTable, createPostsTable, createUsersTable} from './database/db';
import {userRouter} from './routers/authRouters/userRouter';
import {logoutRouter} from './routers/authRouters/logoutRouter';
import {profileRouter} from './routers/usersRouters/profileRouter';
import {updateProfileRouter} from './routers/authRouters/updateProfileRouter';
import {getUsersRouter} from './routers/usersRouters/getUsersRouter';
import {addRemoveFriendRouter} from './routers/friendshipsRouters/addRemoveFriendRouter';
import {getFriendshipRouter} from './routers/friendshipsRouters/getFriendshipRouter';
import {createPostRouter} from './routers/postRouters/createPostRouter';
import {getPostRouter} from './routers/postRouters/getPostRouter';
import {getPostsRouter} from './routers/postRouters/getPostsRouter';
import {getFriendsRouter} from './routers/friendshipsRouters/getFriendsRouter';
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
	.then(() => {
		createPostsTable('luminio_posts')
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
app.use(userRouter);
app.use(logoutRouter);

// Users routes
app.use(getUsersRouter('luminio_users'));

// Friendship routes
app.use(addRemoveFriendRouter('luminio_friendships', 'luminio_users'));
app.use(getFriendshipRouter('luminio_friendships'));
app.use(getFriendsRouter('luminio_friendships', 'luminio_users'));

// Post routes
app.use(createPostRouter('luminio_posts'));
app.use(getPostRouter('luminio_posts', 'luminio_users'));
app.use(getPostsRouter('luminio_posts', 'luminio_users'));

// Error handler
app.use(errorMiddleware);

if (NODE_ENV !== 'test') {
	app.listen(PORT, () => {
		console.log(`Listening to server on port ${PORT}`);
	});
}
