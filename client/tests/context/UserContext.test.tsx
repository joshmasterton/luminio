/* eslint-disable @typescript-eslint/naming-convention */
import {
	type Mock,
	beforeEach, describe, expect, test, vi,
} from 'vitest';
import {request} from '../../src/utilities/requests';
import {act} from 'react';
import {type RenderResult, render} from '@testing-library/react';
import {UserProvider, useUser} from '../../src/context/UserContext';
import {ProtectedRoute} from '../../src/utilities/ProtectedRoute';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';
import {ThemeProvider} from '../../src/context/ThemeContext';
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

const createRouter = () => createMemoryRouter(routes, {initialEntries: ['/']});

describe('UserProvider', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('Renders loading state initially', () => {
		const mockComponent = render(
			<ThemeProvider>
				<UserProvider>
					<div>Child</div>
				</UserProvider>
			</ThemeProvider>,
		);

		expect(mockComponent.getByText('Loading')).toBeInTheDocument();
	});

	test('Fetches user data succesfully', async () => {
		const mockUser = {
			id: 1,
			username: 'testUser',
			email: 'test@email.com',
			friends: 0,
			likes: 0,
			dislikes: 0,
			created_at: new Date(),
			last_online: new Date(),
			profile_picture: 'https://zynqa.s3.eu-west-2.amazonaws.com/profilePictureTest.jpg',
		};

		(request as Mock).mockResolvedValueOnce(mockUser);

		let mockComponent: RenderResult | undefined;

		await act(async () => {
			mockComponent = render(
				<ThemeProvider>
					<UserProvider>
						<TestComponent/>
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

		const router = createRouter();

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
			expect(router.state.location.pathname).toBe('/login');
		}
	});
});
