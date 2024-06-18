/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
	type Mock, describe, expect, test, vi,
} from 'vitest';
import {Auth} from '../../src/pages/Auth';
import {render, screen} from '@testing-library/react';
import {RouterProvider} from 'react-router-dom';
import {ContextWrapper, createRouter} from '../mockHelpers/mockHelpers';
import {PublicRoute} from '../../src/utilities/PublicRoute';
import {act} from 'react';
import {request} from '../../src/utilities/requests';
import {mockUser} from '../mockData/mockUser';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

globalThis.URL.createObjectURL = vi.fn();

vi.mock('../../src/utilities/requests', () => ({
	request: vi.fn(),
}));

const file = new File(['test'], 'test.jpg', {type: 'image/jpg'});

const routes = [
	{
		path: '/*',
		element: <div>Mock Element</div>,
	},
	{
		path: '/login',
		element: <PublicRoute><Auth/></PublicRoute>,
	},
	{
		path: '/signup',
		element: <PublicRoute><Auth isSignup/></PublicRoute>,
	},
];

describe('Auth page', () => {
	test('Switching between login and signup page should work', async () => {
		const router = createRouter(routes, '/login');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		const goToSignupLink = screen.getByText('Signup');
		await userEvent.click(goToSignupLink);

		const signupHeader = screen.getByRole('heading', {name: 'Signup'});
		expect(signupHeader).toBeInTheDocument();

		const goToLoginLink = screen.getByText('Login');
		await userEvent.click(goToLoginLink);

		const loginHeader = screen.getByRole('heading', {name: 'Login'});
		expect(loginHeader).toBeInTheDocument();
	});

	test('Inputs should update value', async () => {
		const router = createRouter(routes, '/signup');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
		const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
		const profilePictureInput = screen.getByLabelText('Profile Picture') as HTMLInputElement;
		const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
		const confirmPasswordInput = screen.getByLabelText('Confirm Password') as HTMLInputElement;

		await userEvent.type(usernameInput, 'testUser');
		await userEvent.type(emailInput, 'testUser@email.com');
		await userEvent.upload(profilePictureInput, file);
		await userEvent.type(passwordInput, 'Password');
		await userEvent.type(confirmPasswordInput, 'Password');

		expect(usernameInput.value).toBe('testUser');
		expect(emailInput.value).toBe('testUser@email.com');
		expect(passwordInput.value).toBe('Password');
		expect(confirmPasswordInput.value).toBe('Password');
	});

	test('Should reveal password text on button click', async () => {
		const router = createRouter(routes, '/signup');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		const showPasswordButton = screen.getByLabelText('Show Password');
		const showConfirmPasswordButton = screen.getByLabelText('Show Confirm Password');

		const passswordInput = screen.getByLabelText('Password');
		const confirmPassswordInput = screen.getByLabelText('Confirm Password');

		await userEvent.click(showPasswordButton);
		await userEvent.click(showConfirmPasswordButton);

		expect(passswordInput).toHaveAttribute('type', 'text');
		expect(confirmPassswordInput).toHaveAttribute('type', 'text');

		await userEvent.click(showPasswordButton);
		await userEvent.click(showConfirmPasswordButton);

		expect(passswordInput).toHaveAttribute('type', 'password');
		expect(confirmPassswordInput).toHaveAttribute('type', 'password');
	});

	test('Should handle signup submit', async () => {
		const router = createRouter(routes, '/signup');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
		const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
		const profilePictureInput = screen.getByLabelText('Profile Picture') as HTMLInputElement;
		const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
		const confirmPasswordInput = screen.getByLabelText('Confirm Password') as HTMLInputElement;

		await userEvent.type(usernameInput, 'testUser');
		await userEvent.type(emailInput, 'testUser@email.com');
		await userEvent.upload(profilePictureInput, file);
		await userEvent.type(passwordInput, 'Password');
		await userEvent.type(confirmPasswordInput, 'Password');

		(request as Mock).mockResolvedValueOnce(mockUser);

		const signupButton = screen.getByRole('button', {name: 'Signup'});
		await userEvent.click(signupButton);

		expect(request).toHaveBeenCalledWith('/signup', 'POST', expect.any(FormData), true);
		expect(router.state.location.pathname).toBe('/');
	});

	test('Should popup error on signup submit error', async () => {
		const router = createRouter(routes, '/signup');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		(request as Mock).mockRejectedValueOnce(new Error('Network error'));

		const signupButton = screen.getByRole('button', {name: 'Signup'});
		await userEvent.click(signupButton);

		expect(screen.getByText('Network error')).toBeInTheDocument();
	});

	test('Should popup error if profile picture type is not image format', async () => {
		const invalidFile = new File(['image'], 'image.txt', {type: 'text/plain'});
		const router = createRouter(routes, '/signup');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		const profilePictureInput = screen.getByLabelText('Profile Picture') as HTMLInputElement;
		await userEvent.upload(profilePictureInput, invalidFile);

		expect(screen.getByText('Must be a valid image type')).toBeInTheDocument();
	});

	test('Should handle login submit', async () => {
		const router = createRouter(routes, '/login');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
		const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

		await userEvent.type(usernameInput, 'testUser');
		await userEvent.type(passwordInput, 'Password');

		(request as Mock).mockResolvedValueOnce(mockUser);

		const loginButton = screen.getByRole('button', {name: 'Login'});
		await userEvent.click(loginButton);

		expect(request).toHaveBeenCalledWith('/login', 'POST', {
			username: usernameInput.value,
			password: passwordInput.value,
		});
		expect(router.state.location.pathname).toBe('/');
	});

	test('Should popup error on login submit error', async () => {
		const router = createRouter(routes, '/login');
		await act(async () => {
			render(<ContextWrapper><RouterProvider router={router}/></ContextWrapper>);
		});

		(request as Mock).mockRejectedValueOnce(new Error('Network error'));

		const loginButton = screen.getByRole('button', {name: 'Login'});
		await userEvent.click(loginButton);

		expect(screen.getByText('Network error')).toBeInTheDocument();
	});
});
