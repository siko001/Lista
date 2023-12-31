import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';

const Container = styled.div`
	padding: 50px 0;
	width: 100%;
	min-height: 117px;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	@media screen and (max-width: 750px) {
		min-height: 108px;
	}
	h3 {
		margin: 0 auto;
	}
	div {
		display: flex;
		flex-direction: column;
		text-align: center;
		gap: 10px;
	}
`;

const Footer = () => {
	const { translate } = useLanguage();
	return (
		<Container>
			<div>
				<h3>{translate('footerHeaderTop')} </h3>
				<h4 className="lighter">{translate('footerHeaderBottom')}</h4>
			</div>
		</Container>
	);
};

export default Footer;
