import React from 'react';
import styled from 'styled-components';
import Setting from './Setting';

const Container = styled.div`
	padding: 0 10px;
	width: 100%;
	min-height: 100px;
	border-bottom: 1px solid white;
`;

const NavMenu = ({ click, steps }) => {
	const handleDarkModeChange = (darkModeValue) => {
		setDarkMode(darkModeValue);
	};
	return (
		<Container className={`${click ? 'goSlowDown' : 'goSlowUp'}`}>
			<Setting steps={steps} onChangeDarkMode={handleDarkModeChange} />
		</Container>
	);
};

export default NavMenu;
