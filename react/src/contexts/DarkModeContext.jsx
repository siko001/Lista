import React, { createContext, useState, useContext, useEffect } from 'react';

const DarkModeContext = createContext();

const DarkModeProvider = ({ children }) => {
	const storedTheme = localStorage.getItem('theme');
	const initialTheme = storedTheme === 'true';
	const [darkMode, setDarkMode] = useState(initialTheme);

	useEffect(() => {
		localStorage.setItem('theme', darkMode);
	}, [darkMode]);

	return <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>{children}</DarkModeContext.Provider>;
};

const useDarkMode = () => {
	const context = useContext(DarkModeContext);
	if (!context) {
		throw new Error('useDarkMode must be used within a DarkModeProvider');
	}
	return context;
};

export { DarkModeProvider, useDarkMode };
