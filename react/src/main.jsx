import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './Router.jsx';
import './index.css';
import { DarkModeProvider } from './contexts/DarkModeContext.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
	<LanguageProvider>
		<DarkModeProvider>
		
				<RouterProvider router={router} />
		
		</DarkModeProvider>
	</LanguageProvider>
);
