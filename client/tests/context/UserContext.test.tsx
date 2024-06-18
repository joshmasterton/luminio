import {
	type Mock, describe, expect, test, vi,
} from 'vitest';
import {request} from '../../src/utilities/requests';
import {act} from 'react';
import {type RenderResult, render, screen} from '@testing-library/react';
import {UserProvider, useUser} from '../../src/context/UserContext';
import {ProtectedRoute} from '../../src/utilities/ProtectedRoute';
import {RouterProvider} from 'react-router-dom';
import {createRouter} from '../mockHelpers/mockHelpers';
import {ThemeProvider} from '../../src/context/ThemeContext';
import {mockUser} from '../mockData/mockUser';
import '@testing-library/jest-dom';

vi.mock('../../src/utilities/requests', () => ({
	request: vi.fn(),
}));

const TestComponent = () => {
	const {user} = useUser();
	return (
		<>
			<div>{user?.username}</div>
			<div>{user?.email}</div>
		</>
	);
};

const routes = [
	{
		path: '/*',
		element: <ProtectedRoute><TestComponent/></ProtectedRoute>,
	},
	{
		path: '/login',
		element: <div>Login</div>,
	},
];

const router = createRouter(routes, '/');

describe('UserProvider', () => {
	test('Fetches user data succesfully', async () => {
		(request as Mock).mockResolvedValueOnce(mockUser);

		let mockComponent: RenderResult | undefined;

		await act(async () => {
			mockComponent = render(
				<ThemeProvider>
					<UserProvider>
						<RouterProvider router={router}/>
					</UserProvider>
				</ThemeProvider>,
			);
		});

		expect(request).toHaveBeenCalledWith('/user', 'GET');

		if (mockComponent) {
			expect(mockComponent.getByText(mockUser.username)).toBeInTheDocument();
			expect(mockComponent.getByText(mockUser.email)).toBeInTheDocument();
		} else {
			throw new Error('mockComponent is undefined');
		}
	});

	test('Redirect user to login page on error or no user found', async () => {
		(request as Mock).mockRejectedValueOnce(new Error('Failed to fetch user data'));

		let mockComponent: RenderResult | undefined;

		await act(async () => {
			mockComponent = render(
				<ThemeProvider>
					<UserProvider>
						<RouterProvider router={router}/>
					</UserProvider>
				</ThemeProvider>,
			);
		});

		expect(request).toHaveBeenCalledWith('/user', 'GET');
		expect(screen.getByText('Login')).toBeInTheDocument();
	});
});
