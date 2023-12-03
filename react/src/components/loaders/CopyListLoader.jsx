import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';

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
	.loader {
		position: relative;
		height: 200px;
		width: 200px;
		border-bottom: 3px solid #ff3d00;
		box-sizing: border-box;
		animation: drawLine 4s linear infinite;
	}
	.loader:before {
		content: '';
		position: absolute;
		left: calc(100% + 14px);
		bottom: -6px;
		width: 16px;
		height: 100px;
		border-radius: 20px 20px 50px 50px;
		background-repeat: no-repeat;
		background-image: linear-gradient(#ff3d00 6px, transparent 0), linear-gradient(45deg, rgba(0, 0, 0, 0.02) 49%, white 51%),
			linear-gradient(315deg, rgba(0, 0, 0, 0.02) 49%, white 51%),
			linear-gradient(to bottom, #ffffff 10%, #ff3d00 10%, #ff3d00 90%, #ffffff 90%);
		background-size: 3px 3px, 8px 8px, 8px 8px, 16px 88px;
		background-position: center bottom, left 88px, right 88px, left top;
		transform: rotate(25deg);
		animation: pencilRot 4s linear infinite;
	}

	@keyframes drawLine {
		0%,
		100% {
			width: 0px;
		}
		45%,
		55% {
			width: 200px;
		}
	}

	@keyframes pencilRot {
		0%,
		45% {
			bottom: -6px;
			left: calc(100% + 14px);
			transform: rotate(25deg);
		}
		55%,
		100% {
			bottom: -12px;
			left: calc(100% + 16px);
			transform: rotate(220deg);
		}
	}
`;

const CopyListLoader = () => {
	const { translate } = useLanguage();
	return (
		<Container>
			<span className="loader"></span>
			{translate('copy-list')}
		</Container>
	);
};

export default CopyListLoader;
