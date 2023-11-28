// src/components/SharedListActivation.js

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useNavigate } from 'react-router-dom';

// FIX THIS UP CSS AND MAKE IT LOOK NICE..CENTER THE THINGS AND MAKE A LOADER
// IF USER DOESNT HAVE AN ACCOUNT CREATE ONE GUEST ACCOUNT ON THE FLY V.I.P

const SharedListActivation = () => {
	const { token } = useParams();
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
		// Make API request to activate shared link

		const userToCopyLink = localStorage.getItem('ACCESS_TOKEN') || getRandomInt().toString();
		localStorage.setItem('ACCESS_TOKEN', userToCopyLink);
		axiosClient
			.get(`/shared-links/${token}/${userToCopyLink}`)
			.then((response) => {
				console.log(response);
				navigate('/');
			})
			.catch((error) => {
				console.error(error);
				// Implement logic to handle invalid link
			});
	}, [token]);

	return <div>Activating shared link...</div>;
};

export default SharedListActivation;
