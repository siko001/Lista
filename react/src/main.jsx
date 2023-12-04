import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './Router.jsx';
import './index.css';
import { DarkModeProvider } from './contexts/DarkModeContext.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { UserProvider } from './contexts/UserContext.jsx';
import { TourProvider } from '@reactour/tour';
import englishSteps from './tutorials/englishSteps.jsx';
import malteseSteps from './tutorials/malteseSteps.jsx';

const lang = localStorage.getItem('selectedLanguage');
if (lang == 'en') {
	const steps = englishSteps;
	ReactDOM.createRoot(document.getElementById('root')).render(
		<TourProvider steps={steps}>
			<LanguageProvider>
				<DarkModeProvider>
					<UserProvider>
						<RouterProvider router={router} />
					</UserProvider>
				</DarkModeProvider>
			</LanguageProvider>
		</TourProvider>
	);
}
if (lang == 'mt') {
	const steps = malteseSteps;
	ReactDOM.createRoot(document.getElementById('root')).render(
		<TourProvider steps={steps}>
			<LanguageProvider>
				<DarkModeProvider>
					<UserProvider>
						<RouterProvider router={router} />
					</UserProvider>
				</DarkModeProvider>
			</LanguageProvider>
		</TourProvider>
	);
}
