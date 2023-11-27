// UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../axiosClient';

const UserContext = createContext({
	user: null,
	token: null,
	setUser: () => {},
	setToken: () => {},
});

const UserProvider = ({ children }) => {
	const [user, setUser] = useState({
		name: '',
		email: '',
	});
	const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

	const setToken = (token) => {
		_setToken(token);
		if (token) {
			localStorage.setItem('ACCESS_TOKEN', token);
		} else {
			localStorage.removeItem('ACCESS_TOKEN');
		}
	};

	const loginUser = async (credentials) => {
		try {
			const response = await axiosClient.post('/login', credentials);
			const userData = response.data;
			localStorage.setItem('ACCESS_TOKEN', userData.token);
			setUser(userData.user);
		} catch (error) {
			console.error('Login failed:', error);
		}
	};

	const logoutUser = () => {
		localStorage.removeItem('ACCESS_TOKEN');
		setUser(null);
	};

	const registerUser = async (userData) => {
		try {
			const response = await axiosClient.post('/register', userData);
			const newUser = response.data;
			localStorage.setItem('ACCESS_TOKEN', newUser.token);
			setUser(newUser.user);
		} catch (error) {
			console.error('Registration failed:', error);
		}
	};

	const getRandomInt = () => {
		try {
			const array = new Uint32Array(1);
			window.crypto.getRandomValues(array);
			return array[0];
		} catch (error) {
			console.error('Error generating random integer:', error);
			// Fallback to Math.random() if crypto API is not available
			return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
		}
	};

	useEffect(() => {
		const initializeToken = () => {
			const token = localStorage.getItem('ACCESS_TOKEN') || getRandomInt().toString();
			localStorage.setItem('ACCESS_TOKEN', token);
			if (token) {
				const fetchUser = () => {
					try {
						const response = axiosClient.get('/user/' + token);
					} catch (error) {
					} finally {
					}
				};
				fetchUser();
			}
		};

		initializeToken();
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser, token, setToken, loginUser, logoutUser, registerUser }}>
			{children}
		</UserContext.Provider>
	);
};

const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};

export { UserProvider, useUser };
