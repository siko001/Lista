import React from 'react';
import styled from 'styled-components';
import Setting from '../components/Setting';

const Container = styled.div`
	padding: 0 10px;
	width: 100%;
	min-height: 100px;
	border-bottom: 1px solid white;
`;

const NavMenu = () => {
	const handleDarkModeChange = (darkModeValue) => {
		setDarkMode(darkModeValue);
	};
	return (
		<Container>
			<Setting onChangeDarkMode={handleDarkModeChange} />
		</Container>
	);
};

export default NavMenu;
