import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import NavMenu from './NavMenu';
import { useLocation, Link } from 'react-router-dom'; // Import useLocation

const Nav = styled.div`
	height: 50px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 20px;
	border-bottom: 1px solid white;

	a {
		color: inhert;
	}
	a:visited {
		color: inherit;
	}
`;

const Lista = styled.div`
	cursor: pointer;
`;
const Menu = styled.div`
	cursor: pointer;
`;

const Navbar = ({ steps }) => {
	const [navbar, setNavbar] = useState(false);
	const [click, setClick] = useState(false);

	const handleOpenNav = () => {
		setClick((pre) => !pre);
		setTimeout(() => {
			setNavbar((pre) => !pre);
		}, 200);
	};

	return (
		<>
			<Nav>
				<Lista>
					<Link to="/">
						<h2 className="boldest">Lista</h2>
					</Link>
				</Lista>
				<Menu className="largest">
					<FontAwesomeIcon className="first-step" icon={faBars} onClick={handleOpenNav} />
				</Menu>
			</Nav>
			{navbar && <NavMenu steps={steps} click={click} />}
		</>
	);
};

export default Navbar;
