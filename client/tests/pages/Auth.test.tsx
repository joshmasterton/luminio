import {
	beforeEach,
	describe, expect, test, vi,
} from 'vitest';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';
import {ThemeProvider} from '../../src/context/ThemeContext';
import {render} from '@testing-library/react';
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
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('Should render Login page', () => {
		const router = createRouter();
		const auth = render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);
		expect(auth.getByRole('heading', {name: 'Login'}));
	});

	test('Should render Signup page after user navigates', async () => {
		const router = createRouter();
		const auth = render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);

		const switchPageLink = auth.getByRole('link', {name: 'Signup'});
		await userEvent.click(switchPageLink);

		const signupHeading = auth.getByRole('heading', {name: 'Signup'});
		const emailLabelElement = auth.getByLabelText('Email');
		const confirmPasswordLabelElement = auth.getByLabelText('Confirm Password');

		expect(signupHeading).toBeInTheDocument();
		expect(emailLabelElement).toBeInTheDocument();
		expect(confirmPasswordLabelElement).toBeInTheDocument();
	});

	test('Should update state when input changes', async () => {
		const router = createRouter();
		const auth = render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);

		const usernameInput = auth.getByLabelText('Username') as HTMLInputElement;
		const passwordInput = auth.getByLabelText('Password') as HTMLInputElement;

		await userEvent.clear(usernameInput);
		await userEvent.clear(passwordInput);

		await userEvent.type(usernameInput, 'testUser');
		await userEvent.type(passwordInput, 'Password');

		expect(usernameInput.value).toBe('testUser');
		expect(passwordInput.value).toBe('Password');
	});

	test('Should handle file input type correctly', async () => {
		const router = createRouter();
		const auth = render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);
		const testFile = new File(['test content'], 'test.png', {type: 'image/png'});

		const switchPageLink = auth.getByRole('link', {name: 'Signup'});
		await userEvent.click(switchPageLink);

		const fileInput = auth.getByLabelText('Profile Picture') as HTMLInputElement;
		await userEvent.upload(fileInput, testFile);

		expect(fileInput?.files?.[0]).toEqual(testFile);
		expect(fileInput?.files?.[0].name).toBe('test.png');
	});

	test('Should handle form submission for login', async () => {
		const router = createRouter();
		const auth = render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);

		const submitButton = auth.getByRole('button', {name: 'Login'});
		await userEvent.click(submitButton);

		expect(request).toHaveBeenCalledWith('/login', 'POST', expect.anything());
	});

	test('Should handle form submission for signup', async () => {
		const router = createRouter();
		const auth = render(
			<ThemeProvider>
				<RouterProvider router={router}/>
			</ThemeProvider>,
		);

		const switchPageLink = auth.getByRole('link', {name: 'Signup'});
		await userEvent.click(switchPageLink);

		const submitButton = auth.getByRole('button', {name: 'Signup'});
		await userEvent.click(submitButton);

		expect(request).toHaveBeenCalledWith('/signup', 'POST', expect.any(FormData), true);
	});
});
