import {beforeAll} from "vitest";
import {queryDb} from "../src/database/db";

beforeAll(async () => {
	const tablesResult = await queryDb(`
		SELECT table_name
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
	`, [])

	// const tables = tablesResult.rows;

	// if (Array.isArray(tables)) {
	// 	for (const row of tables) {
	// 		const tableName = row.table_name;
	// 		await queryDb(`DROP TABLE IF EXISTS ${tableName} CASCADE;`, []);
	// 		console.log(`Dropped table: ${tableName}`);
	// 	}
	// }
});
