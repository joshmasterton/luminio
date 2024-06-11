/* eslint-disable @typescript-eslint/naming-convention */
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config({path: './src/.env'});

const {DB_USER, DB_HOST, DB_PASSWORD} = process.env;

export const pool = new pkg.Pool({
	user: DB_USER,
	host: DB_HOST,
	password: DB_PASSWORD,
});

export const queryDb = async <T>(command: string, params: T[]) => {
	const client = await pool.connect();

	try {
		const result = await client.query(command, params);

		return result;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	} finally {
		client.release();
	}
};

export const createUsersTable = async (tableName: string) => {
	try {
		await queryDb(`
			CREATE TABLE IF NOT EXISTS ${tableName} (
				id SERIAL PRIMARY KEY,
				username VARCHAR(255) NOT NULL,
				username_lower_case VARCHAR(255) NOT NULL,
				email VARCHAR(255) NOT NULL,
				password VARCHAR(255) NOT NULL,
				friends INT DEFAULT 0,
				likes INT DEFAULT 0,
				dislikes INT DEFAULT 0,
				created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
				last_online TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
				profile_picture VARCHAR(255) NOT NULL
			)
		`, []);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
	}
};

export const dropUsersTable = async (tableName: string) => {
	try {
		await queryDb(`DROP TABLE IF EXISTS ${tableName}`, []);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
	}
};
