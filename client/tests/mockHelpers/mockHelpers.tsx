import {type Routes} from '../../src/types/utilities/routes.types';
import {type ReactNode} from 'react';
import {createMemoryRouter} from 'react-router-dom';
import {ThemeProvider} from '../../src/context/ThemeContext';
import {UserProvider} from '../../src/context/UserContext';
import {Popup, PopupProvider} from '../../src/context/PopupContext';

export const createRouter = (routes: Routes[], initialEntry: string) => createMemoryRouter(routes, {initialEntries: [initialEntry]});

export const ContextWrapper = ({children}: {children: ReactNode}) => (
	<ThemeProvider>
		<UserProvider>
			<PopupProvider>
				{children}
				<Popup/>
			</PopupProvider>
		</UserProvider>
	</ThemeProvider>
);
