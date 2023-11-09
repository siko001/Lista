// LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import enTranslations from '../locales/en/translation.json';
import mtTranslations from '../locales/mt/translation.json';

const translations = {
	en: enTranslations,
	mt: mtTranslations,
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
	const storedLanguage = localStorage.getItem('selectedLanguage');
	const initialLanguage = storedLanguage || 'en';
	const [language, setLanguage] = useState(initialLanguage);

	const translate = (key) => {
		return translations[language][key] || key;
	};

	const changeLanguage = (lang) => {
		setLanguage(lang);
	};

	useEffect(() => {
		localStorage.setItem('selectedLanguage', language);
	}, [language]);

	return <LanguageContext.Provider value={{ language, translate, changeLanguage }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
	return useContext(LanguageContext);
};
