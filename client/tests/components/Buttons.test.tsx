import {render, screen} from '@testing-library/react';
import {
	describe, test, expect, vi,
} from 'vitest';
import {createRouter} from '../mockHelpers/mockHelpers';
import {ThemeButton, UserButton} from '../../src/components/Buttons';
import {mockUser} from '../mockData/mockUser';
import {ThemeProvider} from '../../src/context/ThemeContext';
import {RouterProvider} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

vi.mock('../../src/utilities/requests', () => ({
	request: vi.fn(),
}));

const routes = [
	{
		path: '/*',
		element: <UserButton user={mockUser}/>,
	},
	{
		path: '/theme',
		element: (
			<ThemeProvider>
				<ThemeButton/>
			</ThemeProvider>
		),
	},
];

describe('Button components', () => {
	test('Should render user button correctly', () => {
		const router = createRouter(routes, '/');
		render(<RouterProvider router={router}/>);
		expect(screen.getByAltText('Profile Picture')).toHaveAttribute('src', mockUser.profile_picture);
	});

	test('Should be able to toggle theme', async () => {
		const router = createRouter(routes, '/theme');
		render(<RouterProvider router={router}/>);

		const themeButton = screen.getByRole('button');
		expect(themeButton).toHaveClass('dark');

		await userEvent.click(themeButton);
		expect(themeButton).toHaveClass('light');
	});
});
