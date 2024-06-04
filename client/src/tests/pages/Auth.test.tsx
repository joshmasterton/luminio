import {
	describe, expect, test, vi, vitest,
} from 'vitest';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';
import {render} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {Auth} from '../../pages/Auth';
import {request} from '../../utilities/requests';
import '@testing-library/jest-dom';

vitest.mock('../../utilities/requests', () => ({
	request: vi.fn(),
}));

const routes = [
	{
		path: '/*',
		element: <Auth/>,
	},
	{
		path: '/signup',
		element: <Auth isSignup/>,
	},
];

const createRouter = () => createMemoryRouter(routes, {initialEntries: ['/']});

describe('Auth component', () => {
	test('Should render Login page', () => {
		const router = createRouter();
		const auth = render(<RouterProvider router={router}/>);
		expect(auth.getByRole('heading', {name: 'Login'}));
	});

	test('Should render Signup page after user navigates', async () => {
		const router = createRouter();
		const auth = render(<RouterProvider router={router}/>);

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
		const auth = render(<RouterProvider router={router}/>);

		const usernameInput = auth.getByLabelText('Username') as HTMLInputElement;
		const passwordInput = auth.getByLabelText('Password') as HTMLInputElement;

		await userEvent.type(usernameInput, 'testUser');
		await userEvent.type(passwordInput, 'Password');

		expect(usernameInput.value).toBe('testUser');
		expect(passwordInput.value).toBe('Password');
	});

	test('Should handle file input type correctly', async () => {
		const router = createRouter();
		const auth = render(<RouterProvider router={router}/>);
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
		const auth = render(<RouterProvider router={router}/>);

		const submitButton = auth.getByRole('button', {name: 'Login'});
		await userEvent.click(submitButton);

		expect(request).toHaveBeenCalledWith('/login', 'POST', expect.anything());
	});

	test('Should handle form submission for signup', async () => {
		const router = createRouter();
		const auth = render(<RouterProvider router={router}/>);

		const switchPageLink = auth.getByRole('link', {name: 'Signup'});
		await userEvent.click(switchPageLink);

		const submitButton = auth.getByRole('button', {name: 'Signup'});
		await userEvent.click(submitButton);

		expect(request).toHaveBeenCalledWith('/signup', 'POST', expect.any(FormData), true);
	});
});
