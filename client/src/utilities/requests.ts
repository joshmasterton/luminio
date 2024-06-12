import {type ErrorResponse} from '../types/utilities/request.types';

export const request = async <T, R>(url: string, method: string, body?: T, isFormData = false) => {
	const requestOptions: RequestInit = {
		method,
		credentials: 'include',
	};

	if (body) {
		requestOptions.body = isFormData ? body as BodyInit : JSON.stringify(body);
	}

	if (!isFormData) {
		requestOptions.headers = {
			'Content-Type': 'application/json',
		};
	}

	try {
		const response = await fetch(`http://localhost:9001${url}`, requestOptions);

		if (!response.ok) {
			const errorResponse = await response.json() as ErrorResponse;
			throw new Error(errorResponse.error);
		}

		return await response.json() as R;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
