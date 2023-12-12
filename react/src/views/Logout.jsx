import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Loader from '../components/loaders/GetListLoader';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const Text = styled.div`
	z-index: 999;
	margin-top: 50px;
	height: 100vh;
	display: grid;
	place-items: center;
	font-size: 2rem;
	font-weight: 700;
	text-align: center;
`;

const Logout = () => {
	const { translate } = useLanguage();
	const { setToken } = useUser();
	const navigate = useNavigate();

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
		const token = localStorage.getItem('ACCESS_TOKEN') || getRandomInt().toString();
		setToken(token);
	}, []);
	setTimeout(() => {
		navigate('/');
	}, 2000);

	return (
		<>
			<Text>{translate('Log-out')}</Text>
			<Loader></Loader>
		</>
	);
};

export default Logout;
