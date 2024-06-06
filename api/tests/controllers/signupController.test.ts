import {type Request, type Response} from 'express';
import {describe, test, vi, expect} from 'vitest';
import {signup} from '../../src/services/signupServices';
import {signupController} from '../../src/controllers/authControllers/signupController';

vi.mock('../../src/services/authServices/signupServices', () => ({
	signup: vi.fn(),
}));

const res = {
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
};

describe('signupController', () => {
	test('Should return 400 if no profile picture selected', async () => {
		const req: any = {
			body: {},
			file: undefined,
		};

		await signupController(req, res);

		expect(res.status).toHaveBeenCalledWith(400); // Check if status code 400 was set
		expect(res.json).toHaveBeenCalledWith({error: 'No profile picture selected'}); // Check if correct error message was sent in the response
	});
});
