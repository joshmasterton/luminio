import {
	describe, test, expect, vi, type Mock,
} from 'vitest';
import {ProtectedRoute} from '../../src/utilities/ProtectedRoute';
import {Profile} from '../../src/pages/Profile';
import {render, screen} from '@testing-library/react';
import {ContextWrapper, createRouter} from '../mockHelpers/mockHelpers';
import {RouterProvider} from 'react-router-dom';
import {Nav} from '../../src/components/Nav';
import {act} from 'react';
import {request} from '../../src/utilities/requests';
import {mockUser} from '../mockData/mockUser';
import {mockFriendship} from '../mockData/mockFriendship';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

vi.mock('../../src/utilities/requests', () => ({
	request: vi.fn(),
}));

const routes = [
	{
		path: `/profile/${mockUser.username}`,
		element: <ProtectedRoute><Profile/></ProtectedRoute>,
	},
	{
		path: '/*',
		element: <ProtectedRoute><Nav/></ProtectedRoute>,
	},
];

describe('Profile page', () => {
	test('Should render user information', async () => {
		(request as Mock)
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.resolve(mockUser));
		const router = createRouter(routes, `/profile/${mockUser.username}`);
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		expect(screen.getByText(mockUser.username)).toBeInTheDocument();
		expect(screen.getByText(mockUser.email)).toBeInTheDocument();
		expect(screen.getByAltText('Profile Picture')).toHaveAttribute('src', mockUser.profile_picture);
	});

	test('Should navigate out from profile page if no user information', async () => {
		(request as Mock)
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.reject(new Error('Network error')));
		const router = createRouter(routes, '/');
		await router.navigate(`/profile/${mockUser.username}`);
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		expect(router.state.location.pathname).toBe('/');
	});

	test('Should toggle edit form if authorized', async () => {
		(request as Mock)
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.resolve(mockUser));
		const router = createRouter(routes, `/profile/${mockUser.username}`);
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		const editButton = screen.getByLabelText('Edit Button');
		await userEvent.click(editButton);

		const form = screen.getByLabelText('Edit Form');
		expect(form).toBeInTheDocument();

		await userEvent.click(editButton);
		expect(form).not.toBeInTheDocument();
	});

	test('Should update user details on update profile', async () => {
		const updatedUser = {...mockUser, username: 'newUsername'};
		(request as Mock)
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.resolve(mockFriendship))
			.mockImplementationOnce(async () => Promise.resolve(updatedUser));
		const router = createRouter(routes, `/profile/${mockUser.username}`);
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		const editButton = screen.getByLabelText('Edit Button');
		await userEvent.click(editButton);

		const usernameInput = screen.getByLabelText('Username');
		await userEvent.type(usernameInput, 'newUsername');

		const saveUpdateButton = screen.getByRole('button', {name: 'Save'});

		const form = screen.getByLabelText('Edit Form');
		expect(form).toBeInTheDocument();

		await userEvent.click(saveUpdateButton);
		expect(request).toHaveBeenCalledWith('/updateProfile', 'PUT', expect.any(FormData), true);
		expect(screen.getByText('newUsername')).toBeInTheDocument();
	});

	test('Should return error popup on error response', async () => {
		(request as Mock)
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.resolve(mockFriendship))
			.mockImplementationOnce(async () => Promise.reject(new Error('Network error')));
		const router = createRouter(routes, `/profile/${mockUser.username}`);
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		const editButton = screen.getByLabelText('Edit Button');
		await userEvent.click(editButton);

		const usernameInput = screen.getByLabelText('Username');
		await userEvent.type(usernameInput, 'newUsername');

		const saveUpdateButton = screen.getByRole('button', {name: 'Save'});

		const form = screen.getByLabelText('Edit Form');
		expect(form).toBeInTheDocument();

		await userEvent.click(saveUpdateButton);
		expect(screen.getByText('Network error')).toBeInTheDocument();
	});

	test('Should get current friendship status', async () => {
		(request as Mock)
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.resolve(mockFriendship))
			.mockImplementationOnce(async () => Promise.reject(new Error('Network error')));
		const router = createRouter(routes, `/profile/${mockUser.username}`);
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		expect(screen.getByText('Waiting for friendship response')).toBeInTheDocument();
	});
});
