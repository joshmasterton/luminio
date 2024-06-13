import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import {UserProvider} from './context/UserContext';
import {Auth} from './pages/Auth';
import {PublicRoute} from './utilities/PublicRoute';
import {ProtectedRoute} from './utilities/ProtectedRoute';
import {Nav} from './components/Nav';

const routes = [
	{
		path: '/*',
		element: <ProtectedRoute><Nav/></ProtectedRoute>,
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

const router = createBrowserRouter(routes);

export function App() {
	return (
		<UserProvider>
			<RouterProvider router={router}/>
		</UserProvider>
	);
}
