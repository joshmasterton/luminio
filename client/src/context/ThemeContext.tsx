import {
	createContext, useContext, useEffect, useState,
	type MouseEvent,
} from 'react';
import {type ThemeContextType, type ThemeProviderProps} from '../types/context/ThemeContext.types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('Must useTheme within ThemeProvider');
	}

	return context;
};

export const ThemeProvider = ({children}: ThemeProviderProps) => {
	const [theme, setTheme] = useState<string | undefined>(localStorage.getItem('luminio_theme') ?? undefined);

	const applyTheme = (theme: string) => {
		document.documentElement.setAttribute('data-theme', theme);
	};

	const getTheme = () => {
		const currentTheme = localStorage.getItem('luminio_theme');

		if (currentTheme) {
			setTheme(currentTheme);
			applyTheme(currentTheme);
			return currentTheme;
		}

		localStorage.setItem('luminio_theme', 'dark');
		setTheme('dark');
		applyTheme('dark');
		return 'dark';
	};

	const toggleTheme = (e: MouseEvent<HTMLButtonElement>) => {
		if (theme === 'dark') {
			localStorage.setItem('luminio_theme', 'light');
		} else if (theme === 'light') {
			localStorage.setItem('luminio_theme', 'dark');
		}

		setTheme(getTheme());
		applyTheme(getTheme());
		e.currentTarget.blur();
	};

	useEffect(() => {
		getTheme();
	}, []);

	return (
		<ThemeContext.Provider value={{theme, toggleTheme}}>
			{children}
		</ThemeContext.Provider>
	);
};
