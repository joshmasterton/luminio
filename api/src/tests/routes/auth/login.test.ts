import {describe, expect, test} from 'vitest';
import {app} from '../../../app';
import request from 'supertest';

describe('POST /login', () => {
	test('Should return 200 and success message', async () => {
		const res = await request(app)
			.post('/login')
			.send({username: 'testUser', password: 'password'});

		expect(res.status).toBe(200);
		expect(res.body).toEqual({message: 'Login successful'});
	});
});
