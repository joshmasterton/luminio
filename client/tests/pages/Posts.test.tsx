import {
	describe, test, expect, vi, type Mock,
} from 'vitest';
import {ProtectedRoute} from '../../src/utilities/ProtectedRoute';
import {Posts} from '../../src/pages/Posts';
import {render, screen} from '@testing-library/react';
import {ContextWrapper, createRouter} from '../mockHelpers/mockHelpers';
import {RouterProvider} from 'react-router-dom';
import {act} from 'react';
import {request} from '../../src/utilities/requests';
import {mockUser} from '../mockData/mockUser';
import {mockPost, mockPostTwo} from '../mockData/mockPost';
import '@testing-library/jest-dom';

vi.mock('../../src/utilities/requests', () => ({
	request: vi.fn(),
}));

const routes = [
	{
		path: '/',
		element: <ProtectedRoute><Posts/></ProtectedRoute>,
	},
];

describe('Post page', () => {
	test('Should render posts', async () => {
		(request as Mock).mockResolvedValueOnce(mockUser);
		(request as Mock).mockResolvedValueOnce([mockPost, mockPostTwo]);
		const router = createRouter(routes, '/');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		expect(screen.getByText(mockPost.post)).toBeInTheDocument();
	});

	test('Should render error display if no posts', async () => {
		(request as Mock).mockResolvedValueOnce(mockUser);
		(request as Mock).mockRejectedValueOnce(new Error('No posts found'));
		const router = createRouter(routes, '/');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		expect(screen.getByText('No posts')).toBeInTheDocument();
	});
});
