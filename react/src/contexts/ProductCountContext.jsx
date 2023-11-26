// ProductCountContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../axiosClient';

const ProductCountContext = createContext();

const ProductCountProvider = ({ children, id }) => {
	const [productCount, setProductCount] = useState(0);
	const [readyCount, setReadyCount] = useState(0);



	const incrementProductCount = () => {
		setProductCount(productCount + 1);
	};
	const incrementReadyCount = () => {
		setProductCount(readyCount + 1);
	};

	const fetchListTotalProductsfromDb = () => {

	};

	const fetchListTotalProductsFromLocalStorage = (id) => {};

	return <ProductCountContext.Provider value={{ productCount, incrementProductCount }}>{children}</ProductCountContext.Provider>;
};

const useProductCount = () => {
	const context = useContext(ProductCountContext);
	if (!context) {
		throw new Error('useProductCount must be used within a ProductCountProvider');
	}
	return context;
};

export { ProductCountProvider, useProductCount };
