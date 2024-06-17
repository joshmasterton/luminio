import {
	type Mock, describe, test, vi,
	expect,
} from 'vitest';
import {render, screen} from '@testing-library/react';
import {useUser} from '../../src/context/UserContext';
import {ProtectedRoute} from '../../src/utilities/ProtectedRoute';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';
import {mockUser} from '../mockData/mockUser';
import '@testing-library/jest-dom';

vi.mock('../../src/context/UserContext', () => ({
	useUser: vi.fn(),
}));

const routes = [
	{
		path: '/*',
		element: <ProtectedRoute><div>Mock Component</div></ProtectedRoute>,
	},
	{
		path: '/login',
		element: <div>Login</div>,
	},
];

const router = createMemoryRouter(routes);

describe('ProtectedRoute', () => {
	test('Should render children when user is defined', async () => {
		(useUser as Mock).mockReturnValue({user: mockUser});

		render(
			<RouterProvider router={router}/>,
		);

		expect(screen.getByText('Mock Component')).toBeInTheDocument();
	});

	test('Should navigate to login when user is undefined', () => {
		(useUser as Mock).mockReturnValue({user: undefined});

		render(
			<RouterProvider router={router}/>,
		);

		expect(screen.getByText('Login')).toBeInTheDocument();
	});
});
