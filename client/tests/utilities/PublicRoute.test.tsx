import {
	type Mock, describe, test, vi,
	expect,
} from 'vitest';
import {render, screen} from '@testing-library/react';
import {useUser} from '../../src/context/UserContext';
import {PublicRoute} from '../../src/utilities/PublicRoute';
import {RouterProvider} from 'react-router-dom';
import {createRouter} from '../mockHelpers/mockHelpers';
import {mockUser} from '../mockData/mockUser';
import '@testing-library/jest-dom';

vi.mock('../../src/context/UserContext', () => ({
	useUser: vi.fn(),
}));

const routes = [
	{
		path: '/login',
		element: <PublicRoute><div>Mock Component</div></PublicRoute>,
	},
	{
		path: '/',
		element: <div>Home</div>,
	},
];

describe('PublicRoute', () => {
	test('Should navigate to home when user is defined', async () => {
		const router = createRouter(routes, '/login');
		(useUser as Mock).mockReturnValue({user: mockUser});

		render(<RouterProvider router={router}/>);

		expect(screen.getByText('Home')).toBeInTheDocument();
	});

	test('Should render children when user is undefined', () => {
		const router = createRouter(routes, '/login');
		(useUser as Mock).mockReturnValue({user: undefined});

		render(<RouterProvider router={router}/>);

		expect(screen.getByText('Mock Component')).toBeInTheDocument();
	});
});
