import {queryDb} from '../database/db';
import {type User} from '../types/models/userModelsTypes';

export const getUser = async <T>(condition: string, value: T) => {
	try {
		const result = await queryDb(`
			SELECT id, username, email, friends, likes, dislikes,
			created_at, last_online, profile_picture FROM luminio_users
			WHERE ${condition} = $1
		`, [value]);

		return result?.rows[0] as User;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const getUsers = async (sort = 'created_at', page = 0, limit = 1) => {
	try {
		const result = await queryDb(`
			SELECT id, username, email, friends, likes, dislikes,
			created_at, last_online, profile_picture FROM luminio_users
			ORDER BY ${sort} DESC
			LIMIT $1 OFFSET $2
		`, [limit, page]);

		return result?.rows as User[];
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
