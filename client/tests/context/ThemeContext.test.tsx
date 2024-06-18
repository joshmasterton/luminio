import {
	beforeEach, describe, expect, test,
} from 'vitest';
import {ThemeProvider, useTheme} from '../../src/context/ThemeContext';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

function TestComponent() {
	const {theme, toggleTheme} = useTheme();
	return (
		<>
			<div>{theme}</div>
			<button type='button' onClick={toggleTheme}>
				toggleTheme
			</button>
		</>
	);
}

describe('ThemeProvider', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test('Should get current theme', () => {
		render(
			<ThemeProvider>
				<TestComponent/>
			</ThemeProvider>,
		);

		expect(screen.getByText('dark')).toBeInTheDocument();
	});

	test('Should change current theme', async () => {
		render(
			<ThemeProvider>
				<TestComponent/>
			</ThemeProvider>,
		);

		const toggleThemeButton = screen.getByText('toggleTheme');

		await userEvent.click(toggleThemeButton);
		expect(screen.getByText('light')).toBeInTheDocument();

		await userEvent.click(toggleThemeButton);
		expect(screen.getByText('dark')).toBeInTheDocument();
	});
});
