/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
	describe, expect, test, vi,
} from 'vitest';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';
import {ThemeProvider} from '../../src/context/ThemeContext';
import {render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {Nav} from '../../src/components/Nav';
import {Auth} from '../../src/pages/Auth';
import {request} from '../../src/utilities/requests';
import '@testing-library/jest-dom';

vi.mock('../../src/utilities/requests', () => ({
	request: vi.fn(),
}));

vi.mock('../../src/context/UserContext', () => ({
	useUser: () => ({
		setUser: vi.fn(),
	}),
}));

const routes = [
	{
		path: '/*',
		element: <Nav/>,
	},
	{
		path: '/login',
		element: <Auth/>,
	},
	{
		path: '/signup',
		element: <Auth isSignup/>,
	},
];

const createRouter = () => createMemoryRouter(routes, {initialEntries: ['/login']});

describe('Auth component', () => {
	test('Should render Login page', () => {
		const router = createRouter();
		render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);
		expect(screen.getByRole('heading', {name: 'Login'}));
	});

	test('Should render Signup page after user navigates', async () => {
		const router = createRouter();
		render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);

		const switchPageLink = screen.getByRole('link', {name: 'Signup'});
		await userEvent.click(switchPageLink);

		const signupHeading = screen.getByRole('heading', {name: 'Signup'});
		const emailLabelElement = screen.getByLabelText('Email');
		const confirmPasswordLabelElement = screen.getByLabelText('Confirm Password');

		expect(signupHeading).toBeInTheDocument();
		expect(emailLabelElement).toBeInTheDocument();
		expect(confirmPasswordLabelElement).toBeInTheDocument();
	});

	test('Should update state when input changes', async () => {
		const router = createRouter();
		render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);

		const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
		const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

		await userEvent.clear(usernameInput);
		await userEvent.clear(passwordInput);

		await userEvent.type(usernameInput, 'testUser');
		await userEvent.type(passwordInput, 'Password');

		expect(usernameInput.value).toBe('testUser');
		expect(passwordInput.value).toBe('Password');
	});

	test('Should handle file input type correctly', async () => {
		const router = createRouter();
		render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);

		const testFile = new File(['test content'], 'test.png', {type: 'image/png'});

		const switchPageLink = screen.getByRole('link', {name: 'Signup'});
		await userEvent.click(switchPageLink);

		const fileInput = screen.getByLabelText('Profile Picture') as HTMLInputElement;
		await userEvent.upload(fileInput, testFile);

		expect(fileInput?.files?.[0]).toEqual(testFile);
		expect(fileInput?.files?.[0].name).toBe('test.png');
	});

	test('Should handle form submission for login', async () => {
		const router = createRouter();
		render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);

		const submitButton = screen.getByRole('button', {name: 'Login'});
		await userEvent.click(submitButton);

		expect(request).toHaveBeenCalledWith('/login', 'POST', expect.anything());
	});

	test('Should handle form submission for signup', async () => {
		const router = createRouter();
		render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);

		const switchPageLink = screen.getByRole('link', {name: 'Signup'});
		await userEvent.click(switchPageLink);

		const submitButton = screen.getByRole('button', {name: 'Signup'});
		await userEvent.click(submitButton);

		expect(request).toHaveBeenCalledWith('/signup', 'POST', expect.any(FormData), true);
	});
});
