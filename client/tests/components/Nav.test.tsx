/* eslint-disable @typescript-eslint/naming-convention */
import {
	type Mock, beforeEach, describe, test, vi,
	expect,
} from 'vitest';
import userEvent from '@testing-library/user-event';
import {screen} from '@testing-library/react';
import {Nav} from '../../src/components/Nav';
import {ProtectedRoute} from '../../src/utilities/ProtectedRoute';
import {ThemeProvider} from '../../src/context/ThemeContext';
import {UserProvider, useUser} from '../../src/context/UserContext';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';

vi.mock('../../src/context/UserContext', () => ({
	useUser: vi.fn(),
	UserProvider: vi.fn().mockImplementation(({children}) => (
		<div>{children}</div>
	)),
}));

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

const routes = [
	{
		path: '/*',
		element: <ProtectedRoute><Nav/></ProtectedRoute>,
	},
	{
		path: '/login',
		element: <div>Login</div>,
	},
];

const router = createMemoryRouter(routes, {initialEntries: ['/']});

describe('Nav', () => {
	beforeEach(() => {
		(useUser as Mock).mockReturnValue({
			user: mockUser,
			logout: vi.fn().mockImplementation(async () => {
				(useUser as Mock).mockReturnValue({
					user: undefined,
					logout: vi.fn(),
				});

				await router.navigate('/login');
			}),
		});
	});

	test('Renders user information', () => {
		render(
			<ThemeProvider>
				<UserProvider>
					<RouterProvider router={router}/>
				</UserProvider>
			</ThemeProvider>,
		);

		const profilePicture = screen.getAllByAltText('Profile Picture');

		profilePicture.forEach(picture => {
			expect(picture).toBeInTheDocument();
		});
	});

	test('Should log user out on logout click', async () => {
		render(
			<ThemeProvider>
				<UserProvider>
					<RouterProvider router={router}/>
				</UserProvider>
			</ThemeProvider>,
		);

		const logoutButton = screen.getByLabelText('Logout Button 1');

		await userEvent.click(logoutButton);

		expect(router.state.location.pathname).toBe('/login');
	});
});
