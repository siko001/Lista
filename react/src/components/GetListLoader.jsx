import React from 'react';
import styled from 'styled-components';

const Loader = styled.div`
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
	.loader {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: inline-block;
		position: relative;
		background: linear-gradient(0deg, rgba(255, 61, 0, 0.2) 33%, #ff3d00 100%);
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
	}
	.loader::after {
		content: '';
		box-sizing: border-box;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #263238;
	}
	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

const GetListLoader = () => {
	return (
		<Loader>
			<span className="loader"></span>
		</Loader>
	);
};

export default GetListLoader;
