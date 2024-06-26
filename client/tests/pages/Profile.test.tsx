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
import {mockUser, mockUserTwo} from '../mockData/mockUser';
import {mockFriendship, mockFriendshipAccepted} from '../mockData/mockFriendship';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

vi.mock('../../src/utilities/requests', () => ({
	request: vi.fn(),
}));

const routes = [
	{
		path: `/profile/${mockUser.id}`,
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
		const router = createRouter(routes, `/profile/${mockUser.id}`);
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		const imageElements = screen.getAllByAltText('Profile Picture');
		imageElements.forEach(imageElement => {
			expect(imageElement).toHaveAttribute('src', mockUser.profile_picture);
		});

		expect(screen.getByText(mockUser.username)).toBeInTheDocument();
		expect(screen.getByText(mockUser.email)).toBeInTheDocument();
	});

	test('Should navigate out from profile page if no user information', async () => {
		(request as Mock)
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.reject(new Error('Network error')));
		const router = createRouter(routes, '/');
		await router.navigate(`/profile/${mockUser.id}`);
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		expect(router.state.location.pathname).toBe('/');
	});

	test('Should toggle edit form if authorized', async () => {
		(request as Mock)
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.resolve(mockUser));
		const router = createRouter(routes, `/profile/${mockUser.id}`);
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
		const router = createRouter(routes, `/profile/${mockUser.id}`);
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
		const router = createRouter(routes, `/profile/${mockUser.id}`);
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

	test('Should get current not accepted friend request', async () => {
		(request as Mock)
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.resolve(mockUserTwo))
			.mockImplementationOnce(async () => Promise.resolve(mockFriendship));
		const router = createRouter(routes, `/profile/${mockUser.id}`);
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		expect(screen.getByText('Cancel request')).toBeInTheDocument();
	});

	test('Should get current accepted friendship request', async () => {
		(request as Mock)
			.mockImplementationOnce(async () => Promise.resolve(mockUser))
			.mockImplementationOnce(async () => Promise.resolve(mockUserTwo))
			.mockImplementationOnce(async () => Promise.resolve(mockFriendshipAccepted));
		const router = createRouter(routes, `/profile/${mockUser.id}`);
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		expect(screen.getByText('Accept request')).toBeInTheDocument();
		expect(screen.getByText('Decline request')).toBeInTheDocument();
	});
});
