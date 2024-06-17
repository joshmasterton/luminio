import {
	type Mock, describe, test, vi,
	expect,
} from 'vitest';
import {render, screen} from '@testing-library/react';
import {useUser} from '../../src/context/UserContext';
import {mockUser} from '../mockData/mockUser';
import {ProtectedRoute} from '../../src/utilities/ProtectedRoute';
import {Nav} from '../../src/components/Nav';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';
import {ThemeProvider} from '../../src/context/ThemeContext';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

vi.mock('../../src/context/UserContext', () => ({
	useUser: vi.fn(),
}));

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

const router = createMemoryRouter(routes);

describe('Nav', () => {
	test('Should render Nav if user present', () => {
		(useUser as Mock).mockReturnValue({
			user: mockUser,
			logout: vi.fn(),
		});

		render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);

		const profilePictures = screen.getAllByAltText('Profile Picture');

		profilePictures.forEach(profilePicture => {
			expect(profilePicture).toBeInTheDocument();
		});

		expect(screen.getByText(mockUser.username)).toBeInTheDocument();
		expect(screen.getByText(mockUser.email)).toBeInTheDocument();
	});

	test('Should render Login if user not present', () => {
		(useUser as Mock).mockReturnValue({
			user: undefined,
			logout: vi.fn(),
		});

		render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);

		expect(screen.getByText('Login')).toBeInTheDocument();
	});

	test('Should toggle menu visibility on menu click', async () => {
		await router.navigate('/');

		(useUser as Mock).mockReturnValue({
			user: mockUser,
			logout: vi.fn(),
		});

		render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);

		const menuButton = screen.getByLabelText('Menu Button');
		await userEvent.click(menuButton);

		const navDropdown = screen.getByRole('main');
		expect(navDropdown).toHaveClass('active');

		await userEvent.click(menuButton);
		expect(navDropdown).toHaveClass('hidden');
	});
});
