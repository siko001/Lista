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
	text-align: center;
	.loader {
		font-size: 48px;
		color: #fff;
		display: inline-block;
		font-family: Arial, Helvetica, sans-serif;
		font-weight: 400;
		position: relative;
	}
	.loader:after {
		content: '';
		height: 4px;
		width: 0%;
		display: block;
		background: #ff3d00;
		animation: 5s lineGrow linear infinite;
	}

	@keyframes lineGrow {
		to {
			width: 100%;
		}
	}
`;

const EmptyAndDeleteListLoader = () => {
	const { translate } = useLanguage();
	return (
		<Container>
			<div className="loader">{translate('remove-and-delete-loader')}</div>
		</Container>
	);
};

export default EmptyAndDeleteListLoader;
