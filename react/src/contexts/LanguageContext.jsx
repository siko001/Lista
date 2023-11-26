// LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import enTranslations from '../locales/en/translation.json';
import mtTranslations from '../locales/mt/translation.json';
import PopularProducts from '../PopularProducts';

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

	const translateProductNames = () => {
		return PopularProducts.map((product) => {
			const translatedNames = {};
			Object.keys(translations).forEach((lang) => {
				translatedNames[lang] = translations[lang][product.name] || product.name;
				translatedCategories[lang] = translations[lang][product.category] || product.category;
			});

			return {
				...product,
				name: translatedNames,
				category: translatedCategories,
			};
		});
	};

	useEffect(() => {
		localStorage.setItem('selectedLanguage', language);
	}, [language]);

	return (
		<LanguageContext.Provider value={{ language, translate, changeLanguage, translateProductNames }}>{children}</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	return useContext(LanguageContext);
};
