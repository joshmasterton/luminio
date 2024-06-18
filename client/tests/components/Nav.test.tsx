import {render, screen} from '@testing-library/react';
import {
	type Mock,
	describe, expect, test, vi,
} from 'vitest';
import {Nav} from '../../src/components/Nav';
import {ProtectedRoute} from '../../src/utilities/ProtectedRoute';
import {RouterProvider} from 'react-router-dom';
import {ContextWrapper, createRouter} from '../mockHelpers/mockHelpers';
import {mockUser} from '../mockData/mockUser';
import {act} from 'react';
import {request} from '../../src/utilities/requests';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

vi.mock('../../src/utilities/requests', () => ({
	request: vi.fn(),
}));

const routes = [
	{
		path: '/*',
		element: <ProtectedRoute><Nav/></ProtectedRoute>,
	},
];

describe('Nav component', () => {
	test('Should toggle menu button click', async () => {
		(request as Mock).mockResolvedValueOnce(mockUser);
		const router = createRouter(routes, '/');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		const menu = screen.getByRole('main');
		const menuButton = screen.getByRole('button', {name: 'Menu Button'});

		await userEvent.click(menuButton);
		expect(menu).toHaveClass('active');

		await userEvent.click(menuButton);
		expect(menu).toHaveClass('hidden');
	});

	test('Should render user details if user present', async () => {
		(request as Mock).mockResolvedValueOnce(mockUser);
		const router = createRouter(routes, '/');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		await act(async () => {
			expect(screen.getByText(mockUser.username)).toBeInTheDocument();
		});
	});
});
