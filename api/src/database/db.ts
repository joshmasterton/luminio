/* eslint-disable @typescript-eslint/naming-convention */
import pkg from 'pg';
import dotenv from 'dotenv';

const {NODE_ENV} = process.env;

dotenv.config({path: NODE_ENV === 'test' ? './tests/.test.env' : './src/.env'});

const {DB_USER, DB_HOST, DB_PASSWORD, DB_DATABASE} = process.env;

const pool = new pkg.Pool({
	user: DB_USER,
	host: DB_HOST,
	password: DB_PASSWORD,
	database: DB_DATABASE,
});

const adminPool = new pkg.Pool({
	user: DB_USER,
	host: DB_HOST,
	password: DB_PASSWORD,
	database: 'postgres',
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

export const createDatabase = async () => {
	try {
		const client = await adminPool.connect();
		await client.query(`CREATE DATABASE ${DB_DATABASE}`);

		console.log(`Database ${DB_DATABASE} successfully created`);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
	}
};

export const dropDatabase = async () => {
	try {
		const client = await adminPool.connect();
		await client.query(`DROP DATABASE IF EXISTS ${DB_DATABASE}`);

		console.log(`Database ${DB_DATABASE} successfully dropped`);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
	}
};

export const createTables = async () => {
	try {
		await queryDb(`
			CREATE TABLE IF NOT EXISTS luminio_users (
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

export const dropTables = async () => {
	try {
		await queryDb('DROP TABLE IF EXISTS luminio_users', []);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
	}
};
