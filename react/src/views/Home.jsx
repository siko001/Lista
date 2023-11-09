import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import styled from 'styled-components';
import Overlay from '../components/Overlay';
import CreateListLoader from '../components/CreateListLoader';
import Broccoli from '../assets/broccoli-main-page.svg';
import Veg2 from '../assets/Untitled design 3.png';
import ListsContainer from '../components/ListsContainer';
import Footer from '../components/footer';
import { useDarkMode } from '../contexts/DarkModeContext';
import DeleteOverlay from '../components/deleteOverlay';
import Notification from '../components/Notification';
import Navbar from '../components/Navbar';
import axiosClient from '../axiosClient';
import GetListLoader from '../components/GetListLoader';
import DeleteListLoader from '../components/DeleteListLoader';

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
		font-weight: 500;
		margin: 20px 0;
		@media screen and (max-width: 980px) {
			margin: 5px auto;
			font-size: 2rem;
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

const Home = () => {
	// Settings/Gerneral state/Context
	const images = [Broccoli, Veg2];
	const [currentImage, setCurrentImage] = useState(images[0]);
	const { darkMode, setDarkMode } = useDarkMode();
	const { translate } = useLanguage();
	//Lists state
	const [shoppingList, setShoppingList] = useState([]);
	const [lists, setLists] = useState([]);
	// Delete state
	const [deleteOverlay, setDeleteOverlay] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [deleteTitle, setDeleteTitle] = useState(null);

	//overlay state
	const [overlayOpen, setOverlayOpen] = useState(false);
	//message state
	const [message, setMessage] = useState('');
	const [status, setStatus] = useState(200);

	//Loaders State
	const [loading, setLoading] = useState(null);
	const [loadingLists, setLoadingLists] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);

	//Create New List Overlay
	const handleOpenOverlay = () => {
		setOverlayOpen((prevState) => !prevState);
	};
	const handleCancelOverlay = () => {
		setDeleteOverlay((prev) => !prev);
	};

	// Function to fetch and update the list
	const fetchLists = () => {
		axiosClient
			.get('/get-lists')
			.then((res) => {
				setLists(res.data);
				setShoppingList(res.data);
				setLoadingLists(true);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoadingLists(false);
			});
	};

	useEffect(() => {
		fetchLists();
	}, []);

	const addNewList = (newList) => {
		setShoppingList((prevList) => [...prevList, newList]);
	};

	const updateList = () => {
		fetchLists();
	};

	return (
		<Container className={darkMode ? 'darkMode' : 'lightMode'}>
			{/* NavBar Component */}
			<Navbar />

			{/* Delete Components */}
			{deleteOverlay && (
				<DeleteOverlay
					setMessage={setMessage}
					setStatus={setStatus}
					closeOverlay={handleCancelOverlay}
					deleteID={deleteID}
					setDeleteLoader={setDeleteLoader}
					updateList={updateList}
					deleteTitle={deleteTitle}
				/>
			)}
			{deleteLoader && <DeleteListLoader />}

			{/* Create List Components */}
			{overlayOpen && (
				<Overlay
					closeOverlay={handleOpenOverlay}
					setMessage={setMessage}
					setStatus={setStatus}
					setLoading={setLoading}
					addNewList={addNewList}
					fetchLists={fetchLists}
				/>
			)}
			{loading && <CreateListLoader />}

			{/* Header | Dynamically change the heading dynamically according to number of lists*/}
			<Header style={{ justifyContent: shoppingList.length == 0 ? 'center' : '' }}>
				{shoppingList.length != 0 ? (
					<h3>{shoppingList.length == 0 ? '' : shoppingList.length == 1 ? translate('ifList') : translate('ifListmore1')}</h3>
				) : (
					''
				)}
				<button onClick={handleOpenOverlay}>{translate('addBtn')}</button>
			</Header>

			{/* Main Content For Lists */}
			<Main>
				{shoppingList.length === 0 ? (
					<ImageContainer>
						<img src={currentImage} alt="Random Vegetable" />
					</ImageContainer>
				) : (
					<>
						<ListsContainer
							setDeleteOverlay={setDeleteOverlay}
							darkMode={darkMode}
							setMessage={setMessage}
							lists={lists}
							setDeleteID={setDeleteID}
							setDeleteTitle={setDeleteTitle}
							setStatus={setStatus}
							fetchLists={fetchLists}
						/>
					</>
				)}

				{/* Notifications and List Loader */}
				<Notification message={message} status={status} />
				{loadingLists && <GetListLoader />}
			</Main>

			{/* Footer / Sponsers | Components */}
			<Footer />
		</Container>
	);
};

export default Home;
