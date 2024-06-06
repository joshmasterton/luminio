import {queryDb} from '../database/db';
import {type User} from '../types/models/userModelsTypes';

export const getUserByUsernameEmail = async (username: string, email: string) => {
	try {
		const result = await queryDb(`
			SELECT id, username, email, friends, likes, dislikes,
			created_at, last_online, profile_picture FROM luminio_users
			WHERE username = $1 OR email = $2
		`, [username, email]);

		return result?.rows[0] as User;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const createUser = async (username: string, email: string, password: string, profilePicture: string) => {
	try {
		const result = await queryDb(`
			INSERT INTO luminio_users (username, username_lower_case, email, password, profile_picture)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, username, email, friends, likes, dislikes,
			created_at, last_online, profile_picture
		`, [username, username.toLowerCase(), email, password, profilePicture]);

		return result?.rows[0] as User;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
