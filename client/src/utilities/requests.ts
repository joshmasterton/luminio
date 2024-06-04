export const request = async <T, R>(url: string, method: string, body: T, isFormData = false) => {
	const requestOptions: RequestInit = {
		method,
		credentials: 'include',
		body: isFormData ? body as BodyInit : JSON.stringify(body),
		headers: {
			'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
		},
	};

	try {
		const response = await fetch(`http://localhost:9001${url}`, requestOptions);

		if (!response.ok) {
			const errorResponse = await response.json() as ErrorResponse;
			console.log(errorResponse);
			throw new Error(errorResponse.error);
		}

		return await response.json() as R;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
	}
};
