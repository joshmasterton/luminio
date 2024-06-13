import {type MouseEvent, type ReactNode} from 'react';

export type ThemeContextType = {
	theme: string | undefined;
	toggleTheme: (e: MouseEvent<HTMLButtonElement>) => void;
};

export type ThemeProviderProps = {
	children: ReactNode;
};
