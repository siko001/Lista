import React, { createContext, useState, useContext } from 'react';

const DarkModeContext = createContext();

const DarkModeProvider = ({ children }) => {
	const [darkMode, setDarkMode] = useState(true);

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
