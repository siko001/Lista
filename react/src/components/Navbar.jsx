import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import NavMenu from './NavMenu';

const Nav = styled.div`
	height: 50px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 20px;
	border-bottom: 1px solid white;
`;

const Lista = styled.div`
	cursor: pointer;
`;
const Menu = styled.div`
	cursor: pointer;
`;

const Navbar = () => {
	const [navbar, setNavbar] = useState(false);

	const handleOpenNav = () => {
		setNavbar((pre) => !pre);
	};

	return (
		<>
			<Nav>
				<Lista>
					<h2>Lista</h2>
				</Lista>
				<Menu>
					<FontAwesomeIcon icon={faBars} onClick={handleOpenNav} />
				</Menu>
			</Nav>
			{navbar && <NavMenu />}
		</>
	);
};

export default Navbar;
