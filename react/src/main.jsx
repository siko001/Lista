import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './Router.jsx';
import './index.css';
import { DarkModeProvider } from './contexts/DarkModeContext.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { UserProvider } from './contexts/UserContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<LanguageProvider>
		<DarkModeProvider>
			<UserProvider>
				<RouterProvider router={router} />
			</UserProvider>
		</DarkModeProvider>
	</LanguageProvider>
);
