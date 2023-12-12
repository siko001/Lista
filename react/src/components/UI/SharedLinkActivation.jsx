// src/components/SharedListActivation.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../axiosClient';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100vw;
	height: 100vh;
	z-index: 100;
	background-color: rgba(0, 0, 0, 0.7);
	flex-direction: column;
	gap: 20px;
	color: #fff;

	.txt {
		position: relative;
		top: 140px;
		left: -160px;
		font-size: 1.2rem;
		font-weight: 600;
		text-align: center;
		width: 200%;
	}
	.loaderActivate {
		position: relative;
		left: 40px;
		width: 255px;
		height: 200px;
		display: block;
		margin: auto;
		background-image: linear-gradient(#263238 50px, transparent 0), radial-gradient(circle 25px at 25px 25px, #fff 100%, transparent 0),
			radial-gradient(circle 50px at 50px 50px, #fff 100%, transparent 0),
			radial-gradient(circle 25px at 25px 25px, #fff 100%, transparent 0), linear-gradient(#fff 50px, transparent 0);
		background-size: 64px 6px, 50px 50px, 100px 76px, 50px 50px, 120px 40px;
		background-position: 55px 60px, 0px 30px, 37px 0px, 122px 30px, 25px 40px;
		background-repeat: no-repeat;
		position: relative;
		box-sizing: border-box;
	}
	.loaderActivate::after {
		content: '';
		position: absolute;
		left: 34%;
		transform: translateX(-50%) rotate(-180deg);
		top: 62px;
		height: 64px;
		width: 60px;
		background-color: #fff;
		background-image: linear-gradient(#ddd 20px, transparent 0), linear-gradient(#ddd 5px, transparent 0),
			linear-gradient(#ddd 10px, transparent 0), linear-gradient(#ddd 10px, transparent 0);
		background-size: 50px 20px;
		background-position: 5px 36px, 5px 25px, 5px 10px;
		background-repeat: no-repeat;
		border-radius: 2px 2px 4px 4px;
		z-index: 10;
		box-shadow: 0px -4px 7px rgba(0, 0, 0, 0.5);
		box-sizing: border-box;
		-webkit-animation: animloader 4s linear infinite;
		animation: animloader 4s linear infinite;
	}

	@keyframes animloader {
		0% {
			height: 0px;
		}
		90%,
		100% {
			height: 64px;
		}
	}

	@-webkit-keyframes animloader {
		0% {
			height: 0px;
		}
		90%,
		100% {
			height: 64px;
		}
	}

	.loaderRedirect {
		width: 175px;
		height: 200px;
		display: block;
		margin: auto;
		background-image: radial-gradient(circle 25px at 25px 25px, #fff 100%, transparent 0),
			radial-gradient(circle 50px at 50px 50px, #fff 100%, transparent 0),
			radial-gradient(circle 25px at 25px 25px, #fff 100%, transparent 0), linear-gradient(#fff 50px, transparent 0);
		background-size: 50px 50px, 100px 76px, 50px 50px, 120px 40px;
		background-position: 0px 30px, 37px 0px, 122px 30px, 25px 40px;
		background-repeat: no-repeat;
		position: relative;
		box-sizing: border-box;
		transform: translate3d(0, 0, 0);
	}
	.loaderRedirect::after {
		content: '';
		left: -10px;
		right: 0;
		margin: auto;
		top: 30px;
		position: absolute;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 5px solid transparent;
		border-color: #ff3d00 transparent;
		box-sizing: border-box;
		-webkit-animation: rotation 1s linear infinite;
		animation: rotation 1s linear infinite;
	}
	.txt2 {
		position: relative;
		top: 100px;
		left: -80px;
		font-size: 1.2rem;
		font-weight: 600;
		text-align: center;
		width: 200%;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	@-webkit-keyframes rotation {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	.loaderError {
		width: 180px;
		height: 175px;
		display: block;
		margin: 0 auto 20px;
		background-image: radial-gradient(circle 25px at 25px 25px, #fff 100%, transparent 0),
			radial-gradient(circle 50px at 50px 50px, #fff 100%, transparent 0),
			radial-gradient(circle 25px at 25px 25px, #fff 100%, transparent 0),
			radial-gradient(circle 15px at 15px 15px, #fff 100%, transparent 0), linear-gradient(#fff 50px, transparent 0);
		background-size: 50px 50px, 100px 75px, 50px 50px, 30px 32px, 136px 20px;
		background-repeat: no-repeat;
		background-position: 0px 30px, 30px 0px, 113px 29px, 147px 50px, 23px 60px;
		position: relative;
		box-sizing: border-box;
	}
	.loaderError::after {
		content: '';
		position: absolute;
		left: 2px;
		top: 65px;
		width: 2px;
		height: 6px;
		color: #fff;
		box-sizing: border-box;
		-webkit-animation: animloaderError 0.6s linear infinite;
		animation: animloaderError 0.6s linear infinite;
		transform: translate3d(0, 0, 0);
	}

	@keyframes animloaderError {
		0% {
			box-shadow: 25px 0 white, 50px 0 white, 75px 0 white, 100px 0 white, 125px 0 white, 150px 0 white, 25px 0 white, 50px 0 white,
				75px 0 white, 100px 0 white, 125px 0 white, 150px 0 white;
		}
		50% {
			box-shadow: 25px 20px white, 50px 60px rgba(255, 255, 255, 0), 75px 30px rgba(255, 255, 255, 0), 100px 70px rgba(255, 255, 255, 0),
				125px 40px white, 150px 60px rgba(255, 255, 255, 0), 25px 20px white, 50px 30px white, 75px 10px white, 100px 30px white,
				125px 30px rgba(255, 255, 255, 0), 150px 30px rgba(255, 255, 255, 0);
		}
		100% {
			box-shadow: 25px 60px rgba(255, 255, 255, 0), 50px 60px rgba(255, 255, 255, 0), 75px 50px rgba(255, 255, 255, 0),
				100px 70px rgba(255, 255, 255, 0), 125px 70px rgba(255, 255, 255, 0), 150px 60px rgba(255, 255, 255, 0),
				25px 80px rgba(255, 255, 255, 0), 50px 80px rgba(255, 255, 255, 0), 75px 70px rgba(255, 255, 255, 0),
				100px 60px rgba(255, 255, 255, 0), 125px 30px rgba(255, 255, 255, 0), 150px 30px rgba(255, 255, 255, 0);
		}
	}

	@-webkit-keyframes animloaderError {
		0% {
			box-shadow: 25px 0 white, 50px 0 white, 75px 0 white, 100px 0 white, 125px 0 white, 150px 0 white, 25px 0 white, 50px 0 white,
				75px 0 white, 100px 0 white, 125px 0 white, 150px 0 white;
		}
		50% {
			box-shadow: 25px 20px white, 50px 60px rgba(255, 255, 255, 0), 75px 30px rgba(255, 255, 255, 0), 100px 70px rgba(255, 255, 255, 0),
				125px 40px white, 150px 60px rgba(255, 255, 255, 0), 25px 20px white, 50px 30px white, 75px 10px white, 100px 30px white,
				125px 30px rgba(255, 255, 255, 0), 150px 30px rgba(255, 255, 255, 0);
		}
		100% {
			box-shadow: 25px 60px rgba(255, 255, 255, 0), 50px 60px rgba(255, 255, 255, 0), 75px 50px rgba(255, 255, 255, 0),
				100px 70px rgba(255, 255, 255, 0), 125px 70px rgba(255, 255, 255, 0), 150px 60px rgba(255, 255, 255, 0),
				25px 80px rgba(255, 255, 255, 0), 50px 80px rgba(255, 255, 255, 0), 75px 70px rgba(255, 255, 255, 0),
				100px 60px rgba(255, 255, 255, 0), 125px 30px rgba(255, 255, 255, 0), 150px 30px rgba(255, 255, 255, 0);
		}
	}

	.txt3 {
		position: relative;
		bottom: -100px;
		left: -80px;
		font-size: 1.4rem;
		text-align: center;
		width: 200%;

		font-weight: 600;
	}

	.error {
		font-size: 1.8rem;
		font-weight: 800;
		margin-bottom: 20px;
		color: red;
	}
	.redirect {
		left: -10px;
		max-width: 300px;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60px;
		&:hover {
			cursor: pointer;
			border: 1px solid;
		}
	}
`;

const SharedListActivation = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [redirect, setRedirect] = useState(false);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

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

	const handleBackToHome = () => {
		navigate('/');
	};

	useEffect(() => {
		// Make API request to activate shared link
		const userToCopyLink = localStorage.getItem('ACCESS_TOKEN') || getRandomInt().toString();
		localStorage.setItem('ACCESS_TOKEN', userToCopyLink);
		setTimeout(() => {
			axiosClient
				.get(`/shared-links/${token}/${userToCopyLink}`)
				.then((response) => {
					setLoading((prev) => !prev);
					setRedirect((prev) => !prev);
					setTimeout(() => {
						navigate('/');
					}, 1500);
				})
				.catch((error) => {
					setLoading((prev) => !prev);
					setError((prev) => !prev);
					setTimeout(() => {
						setErrorMessage(error.response.data.error);
					}, 2000);
				});
		}, 2500);
	}, [token]);

	return (
		<Container>
			{/* When page first loads */}
			{loading && (
				<div className="loaderActivate">
					<div className="txt">Activating the Link and Connecting The List</div>
				</div>
			)}
			{/* When the page correctly gets the info and everything goes well */}
			{redirect && (
				<div className="loaderRedirect">
					<div className="txt2">Redirecting To Lista with your shared List</div>
				</div>
			)}
			{/* if something goes wrong */}
			{error && (
				<div className="loaderError">
					<div className="txt3 error red">Something wrong</div>
					<div className="txt3 red">{errorMessage}</div>
				</div>
			)}
			{error && (
				<div onClick={handleBackToHome} className="txt3 redirect">
					Redirect To Lista
				</div>
			)}
		</Container>
	);
};

export default SharedListActivation;
