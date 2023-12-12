import { createBrowserRouter } from 'react-router-dom';
import Home from './views/Home';
import ShoppingList from './views/ShoppingList';
import SharedListActivation from './components/UI/SharedLinkActivation';
import Register from './views/Regsiter';
import Login from './views/Login';
import Logout from './views/Logout';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: `/:listName/:id`,
		element: <ShoppingList />,
	},
	{
		path: `*`,
		element: <Home />,
	},
	{
		path: `/shared-list/:token`,
		element: <SharedListActivation />,
	},
	{
		path: `/register`,
		element: <Register />,
	},
	{
		path: `/login`,
		element: <Login />,
	},
	{
		path: '/logout',
		element: <Logout />,
	},
]);

export default router;
