import pkg from 'pg';

const pool = new pkg.Pool({
	user: 'postgres',
	host: 'localhost',
	password: 'Zonomaly1',
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

		console.log('Tables successfully created');
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
	}
};

export const dropTables = async () => {
	try {
		await queryDb('DROP TABLE IF EXISTS luminio_users', []);
		console.log('Tables successfully dropped');
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
	}
};
