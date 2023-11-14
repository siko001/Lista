import { createBrowserRouter } from 'react-router-dom';
import Home from './views/Home';
import ShoppingList from './views/ShoppingList';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: `/:listName/:id`,
		element: <ShoppingList />,
	},
]);

export default router;
