import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import {Auth} from './pages/Auth';

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

const router = createBrowserRouter(routes);

export function App() {
	return <RouterProvider router={router}/>;
}
