import {
	describe, test, expect, vi, type Mock,
} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ProtectedRoute} from '../../src/utilities/ProtectedRoute';
import {CreatePost} from '../../src/pages/CreatePost';
import {ContextWrapper, createRouter} from '../mockHelpers/mockHelpers';
import {RouterProvider} from 'react-router-dom';
import {mockUser} from '../mockData/mockUser';
import {request} from '../../src/utilities/requests';
import {act} from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

vi.mock('../../src/utilities/requests', () => ({
	request: vi.fn(),
}));

const routes = [
	{
		path: '/*',
		element: <ProtectedRoute><CreatePost/></ProtectedRoute>,
	},
];

describe('CreatePost page', () => {
	test('Should render post page form', async () => {
		(request as Mock).mockResolvedValueOnce(mockUser);
		const router = createRouter(routes, '/createPost');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		expect(screen.getByPlaceholderText('How are you today?'));
	});

	test('Update picture and text at createPost form', async () => {
		(request as Mock).mockResolvedValueOnce(mockUser);
		const router = createRouter(routes, '/createPost');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		const input = screen.getByPlaceholderText('How are you today?');
		await userEvent.type(input, 'New post text');

		const send = screen.getByRole('button', {name: 'Send'});

		await userEvent.click(send);

		expect(request).toHaveBeenCalledWith('/createPost', 'POST', expect.any(FormData), true);
		expect(router.state.location.pathname).toBe('/');
	});
});
