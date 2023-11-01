import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './Router.jsx';
import './index.css';
import { DarkModeProvider } from './contexts/DarkModeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<DarkModeProvider>
			<RouterProvider router={router} />
		</DarkModeProvider>
	</React.StrictMode>
);
