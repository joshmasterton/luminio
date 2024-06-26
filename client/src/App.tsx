import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext';
import {UserProvider} from './context/UserContext';
import {Auth} from './pages/Auth';
import {PublicRoute} from './utilities/PublicRoute';
import {ProtectedRoute} from './utilities/ProtectedRoute';
import {Popup, PopupProvider} from './context/PopupContext';
import {Profile} from './pages/Profile';
import {Users} from './pages/Users';
import {Nav} from './components/Nav';
import {Error} from './pages/Error';
import './styles/App.scss';

const routes = [
	{
		path: '/*',
		element: <ProtectedRoute><Nav/></ProtectedRoute>,
		errorElement: <Error/>,
	},
	{
		path: '/users',
		element: <ProtectedRoute><Users/></ProtectedRoute>,
		errorElement: <Error/>,
	},
	{
		path: '/profile/:username',
		element: <ProtectedRoute><Profile/></ProtectedRoute>,
		errorElement: <Error/>,
	},
	{
		path: '/login',
		element: <PublicRoute><Auth/></PublicRoute>,
		errorElement: <Error/>,
	},
	{
		path: '/signup',
		element: <PublicRoute><Auth isSignup/></PublicRoute>,
		errorElement: <Error/>,
	},
];

const router = createBrowserRouter(routes);

export function App() {
	return (
		<ThemeProvider>
			<UserProvider>
				<PopupProvider>
					<RouterProvider router={router}/>
					<Popup/>
				</PopupProvider>
			</UserProvider>
		</ThemeProvider>
	);
}
