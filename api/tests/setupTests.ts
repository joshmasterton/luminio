import {beforeAll} from "vitest";
import {queryDb} from "../src/database/db";

beforeAll(async () => {
	await queryDb(`
		SELECT table_name
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
	`, [])
});
