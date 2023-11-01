import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Overlay from '../components/Overlay';
import { useDarkMode } from '../contexts/DarkModeContext';
import Setting from '../components/Setting';
import Broccoli from '../assets/broccoli-main-page.svg';
import Veg2 from '../assets/Untitled design 3.png';
import ListsContainer from '../components/ListsContainer';
import Footer from '../components/footer';

const Container = styled.div`
	min-height: 100vh;
`;

const Header = styled.div`
	margin: 0 auto;
	width: 60%;
	display: flex;
	gap: 10px;
	justify-content: space-between;
	padding: 20px 0;
	@media screen and (max-width: 980px) {
		flex-direction: column;
		width: 100%;
	}
	button {
		padding: 0.75rem 1.5rem;
		border-radius: 3px;
		background-color: rgba(10, 107, 222, 0.9);
		color: white;
		font-size: 1.1rem;
		&:hover {
			cursor: pointer;
		}
		@media screen and (max-width: 980px) {
			margin: 5px auto;
			font-size: 0.9rem;
		}
	}

	h3 {
		display: inline-block;
		font-size: 2.5rem;
		@media screen and (max-width: 980px) {
			margin: 0 auto;
			font-size: 1.8rem;
		}
	}
`;

const Main = styled.div`
	display: flex;
	justify-content: center;
`;

const ImageContainer = styled.div`
	position: relative;
	z-index: 0;
	padding-top: 50px;
	img {
		min-height: 300px;
		max-height: 300px;
	}
`;

const images = [Broccoli, Veg2];
const shoppingList = [];

const Home = () => {
	const [overlayOpen, setOverlayOpen] = useState(false);
	const [currentImage, setCurrentImage] = useState(images[0]);
	const { darkMode, setDarkMode } = useDarkMode();

	useEffect(() => {
		const interval = setInterval(() => {
			const randomIndex = Math.floor(Math.random() * images.length);
			setCurrentImage(images[randomIndex]);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const handleOpenOverlay = () => {
		setOverlayOpen((prevState) => !prevState);
	};
	return (
		<Container className={darkMode ? 'darkMode' : 'lightMode'}>
			{/* <Setting setDarkMode={setDarkMode} /> will Add Settings section later on */}
			{overlayOpen && <Overlay closeOverlay={handleOpenOverlay} />}
			<Header style={{ justifyContent: shoppingList.length == 0 ? 'center' : '' }}>
				{shoppingList.length != 0 ? <h3>{shoppingList.length == 0 ? '' : 'Your Shopping Lists'}</h3> : ''}
				<button onClick={handleOpenOverlay}>Create New List</button>
			</Header>
			<Main>
				{shoppingList.length === 0 ? (
					<ImageContainer>
						<img src={currentImage} alt="Random Vegetable" />
					</ImageContainer>
				) : (
					<ListsContainer />
				)}
			</Main>
			<Footer />
		</Container>
	);
};

export default Home;
