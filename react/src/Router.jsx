import { createBrowserRouter } from 'react-router-dom';
import Home from './views/Home';
import ShoppingList from './views/ShoppingList';
import SharedListActivation from './components/UI/SharedLinkActivation';
import Register from './views/Regsiter';

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
]);

export default router;
