import {
	describe, test, expect, vi, type Mock,
} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ProtectedRoute} from '../../src/utilities/ProtectedRoute';
import {Users} from '../../src/pages/Friends';
import {ContextWrapper, createRouter} from '../mockHelpers/mockHelpers';
import {RouterProvider} from 'react-router-dom';
import {act} from 'react';
import {mockUser, mockUserTwo} from '../mockData/mockUser';
import {request} from '../../src/utilities/requests';
import '@testing-library/jest-dom';

vi.mock('../../src/utilities/requests', () => ({
	request: vi.fn(),
}));

const routes = [
	{
		path: '/users',
		element: <ProtectedRoute><Users/></ProtectedRoute>,
	},
];

describe('Users page', () => {
	test('Should render users', async () => {
		(request as Mock).mockImplementationOnce(async () => Promise.resolve(mockUser));
		(request as Mock).mockImplementationOnce(async () => Promise.resolve([mockUser, mockUserTwo]));
		const router = createRouter(routes, '/users');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		expect(screen.getByText(mockUserTwo.username)).toBeInTheDocument();
	});

	test('Should render no users if no users', async () => {
		(request as Mock).mockImplementationOnce(async () => Promise.resolve(mockUser));
		(request as Mock).mockImplementationOnce(async () => Promise.resolve(undefined));
		const router = createRouter(routes, '/users');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		expect(screen.getByText('No users')).toBeInTheDocument();
	});
});
