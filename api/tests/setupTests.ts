import {afterEach, afterAll, beforeAll, beforeEach} from 'vitest';
import {createDatabase, createTables, dropTables} from '../src/database/db';

beforeAll(async () => {
	await createDatabase();
});

beforeEach(async () => {
	await createTables();
});

afterEach(async () => {
	await dropTables();
});

afterAll(async () => {
	await dropTables();
});
