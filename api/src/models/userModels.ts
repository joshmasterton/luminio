import {queryDb} from '../database/db';
import {type User} from '../types/models/userModels.types';
import bcryptjs from 'bcryptjs';

export const getUser = async <T>(tableName: string, condition: string, value: T) => {
	try {
		const result = await queryDb(`
			SELECT id, username, email, comments, friends, likes, dislikes,
			created_at, last_online, profile_picture FROM ${tableName}
			WHERE ${condition} = $1
		`, [value]);

		return result?.rows[0] as User;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const getUserReturnPassword = async <T>(tableName: string, condition: string, value: T) => {
	try {
		const result = await queryDb(`
			SELECT password FROM ${tableName}
			WHERE ${condition} = $1
		`, [value]);

		return result?.rows[0]?.password as string;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const getUsers = async (tableName: string, sort = 'created_at', page = 0, limit = 1) => {
	try {
		const result = await queryDb(`
			SELECT id, username, email, friends, comments, likes, dislikes,
			created_at, last_online, profile_picture FROM ${tableName}
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

export const createUser = async (tableName: string, username: string, email: string, password: string, profilePicture: string) => {
	try {
		const hashedPassword = await bcryptjs.hash(password, 10);
		const result = await queryDb(`
			INSERT INTO ${tableName} (username, username_lower_case, email, password, profile_picture)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, username, email, friends, comments, likes, dislikes,
			created_at, last_online, profile_picture
		`, [username, username.toLowerCase(), email, hashedPassword, profilePicture]);

		return result?.rows[0] as User;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};

export const updateUser = async (tableName: string, oldUsername: string, username?: string, profilePicture?: string) => {
	try {
		if (username && profilePicture) {
			await queryDb(`
				UPDATE ${tableName}
				SET username = $1, username_lower_case = $2, profile_picture = $3
				WHERE username = $4
			`, [username, username.toLowerCase(), profilePicture, oldUsername]);

			return await getUser(tableName, 'username', username);
		}

		if (username) {
			await queryDb(`
				UPDATE ${tableName}
				SET username = $1, username_lower_case = $2
				WHERE username = $3
			`, [username, username.toLowerCase(), oldUsername]);

			return await getUser(tableName, 'username', username);
		}

		if (profilePicture) {
			await queryDb(`
				UPDATE ${tableName}
				SET profile_picture = $1
				WHERE username = $2
			`, [profilePicture, oldUsername]);

			return await getUser(tableName, 'username', oldUsername);
		}
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
