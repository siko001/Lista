import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import styled from 'styled-components';
import Overlay from '../components/overlays/Overlay';
import CreateListLoader from '../components/loaders/CreateListLoader';
import Veg2 from '../assets/Untitled design 3.png';
import Des7 from '../assets/des7.svg';
import Des8 from '../assets/des8.svg';
import Des9 from '../assets/des9.svg';
import Des10 from '../assets/des10.svg';
import ListsContainer from '../components/list/ListsContainer';
import Footer from '../components/UI/Footer';
import { useDarkMode } from '../contexts/DarkModeContext';
import DeleteOverlay from '../components/overlays/DeleteOverlay';
import Notification from '../components/UI/Notification';
import Navbar from '../components/UI/Navbar';
import axiosClient from '../axiosClient';
import GetListLoader from '../components/loaders/GetListLoader';
import DeleteListLoader from '../components/loaders/DeleteListLoader';
import CopyListLoader from '../components/loaders/CopyListLoader';
import ShoppingList from './ShoppingList';
import { ProductCountProvider } from '../contexts/ProductCountContext';
import { useTour } from '@reactour/tour';
import { useUser } from '../contexts/UserContext';
import { useLocation } from 'react-router-dom';

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
		border-radius: 5px;
		background-color: rgba(10, 107, 222, 0.9);
		font-size: 1.1rem;
		position: relative;
		overflow: hidden;
		border: none;

		&.type1::after,
		&.type1::before {
			content: '';
			display: block;
			position: absolute;
			width: 20%;
			height: 20%;
			border: 3px solid;
			transition: all 0.6s ease;
			border-radius: 5px;
		}
		&.type1::after {
			bottom: 0;
			right: 0;
			border-top-color: transparent;
			border-left-color: transparent;
		}
		&.type1::before {
			top: 0;
			left: 0;
			border-bottom-color: transparent;
			border-right-color: transparent;
		}

		&.type1:hover:after,
		&.type1:hover:before {
			width: 100%;
			height: 100%;
		}

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
const images = [Veg2, Des7, Des8, Des9, Des10];
const Home = () => {
	// Settings/Gerneral state/Context
	const [currentImage, setCurrentImage] = useState(0);
	const { darkMode } = useDarkMode();
	const { translate } = useLanguage();
	const [totalProducts] = useState(0);
	const [totalReadyProduct] = useState(0);

	const [hiddenComp] = useState(null);
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
	const [share, setShare] = useState();

	//Loaders State
	const [loading, setLoading] = useState(null);
	const [loadingLists, setLoadingLists] = useState(false);
	const [deleteLoader, setDeleteLoader] = useState(false);
	const [copyLoader, setCopyLoader] = useState(false);
	const intervalIdRef = useRef(null);
	const [newList, setNewList] = useState(false);
	const [newListB, setNewListB] = useState(false);
	const [newListId, setnewListId] = useState();
	const [listAboutToDelete, setListAboutToDelete] = useState();

	const { setIsOpen } = useTour();
	useEffect(() => {
		const returningUser = localStorage.getItem('ACCESS_TOKEN');
		if (!returningUser) {
			setIsOpen(true);
		}
		const fromRegistration = localStorage.getItem('registration');
		if (fromRegistration == 'true') {
			setMessage(translate('Registration Successful'));
			localStorage.removeItem('registration');
		}

		const fromLogin = localStorage.getItem('login');
		if (fromLogin == 'true') {
			setMessage('Login Successful');
			localStorage.removeItem('login');
		}

		fetchLists();
		startImageInterval();
		return () => {
			// Clear the interval when the component is unmounted
			if (intervalIdRef.current) {
				clearInterval(intervalIdRef.current);
			}
		};
	}, [share]);

	//Create New List Overlay
	const handleOpenOverlay = () => {
		setOverlayOpen((prevState) => !prevState);
	};
	const handleCancelOverlay = () => {
		setDeleteOverlay((prev) => !prev);
	};

	const fetchLists = () => {
		const userId = localStorage.getItem('ACCESS_TOKEN');
		// Check local storage first
		const storedLists = JSON.parse(localStorage.getItem('shoppingLists'));
		if (storedLists && Array.isArray(storedLists) && storedLists.length > 0) {
			setLists(storedLists);
			const totalProductsArray = storedLists.map((list) => list.totalProductCount);
			setShoppingList(storedLists);
		}

		// Show loader only when there are no lists in local storage
		const shouldShowLoader = !storedLists || (Array.isArray(storedLists) && storedLists.length === 0);
		setLoadingLists(shouldShowLoader);

		userId
			? axiosClient
					.get('/get-lists/' + userId)
					.then((res) => {
						const apiLists = res.data;

						// Update local storage only if the API response differs from storedLists
						if (!arraysEqual(storedLists, apiLists)) {
							localStorage.setItem('shoppingLists', JSON.stringify(apiLists));
						}
						setLists(apiLists);
						setShoppingList(apiLists);
					})
					.catch((err) => {
					
					})
					.finally(() => {
						setLoadingLists(false);
					})
			: setLoadingLists(false);
		// Triggeer the play for the guided tour over here
	};

	// Helper function to compare arrays
	function arraysEqual(arr1, arr2) {
		if (arr1 === arr2) return true;
		if (arr1 == null || arr2 == null) return false;
		if (arr1.length !== arr2.length) return false;

		for (let i = 0; i < arr1.length; i++) {
			if (arr1[i] !== arr2[i]) return false;
		}

		return true;
	}

	const startImageInterval = () => {
		const newIntervalId = setInterval(() => {
			const newIndex = Math.floor(Math.random() * images.length);
			setCurrentImage(newIndex);
		}, 3000);
		intervalIdRef.current = newIntervalId;
	};

	const addNewList = (newList) => {
		setShoppingList((prevList) => [...prevList, newList]);
		setnewListId(newList.id);
	};

	const updateList = () => {
		fetchLists();
	};
	const steps = [];

	return (
		<ProductCountProvider>
			<Container className={`${darkMode ? 'darkMode' : 'lightMode'} `}>
				{/* NavBar Component */}
				<Navbar steps={steps} className="first-step" />

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
						setListAboutToDelete={setListAboutToDelete}
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
						setNewList={setNewList}
						setNewListB={setNewListB}
						steps={steps}
					/>
				)}
				{loading && <CreateListLoader />}
				{/* Header | Dynamically change the heading dynamically according to number of lists*/}
				<Header className="goDownSlow" style={{ justifyContent: shoppingList.length == 0 ? 'center' : '' }}>
					{shoppingList.length != 0 ? (
						<h3>{shoppingList.length == 0 ? '' : shoppingList.length == 1 ? translate('ifList') : translate('ifListmore1')}</h3>
					) : (
						''
					)}
					<button className="type1 sixth-step" style={{ color: darkMode ? 'white' : 'black' }} onClick={handleOpenOverlay}>
						{translate('addBtn')}
					</button>
				</Header>
				{/* Main Content For Lists */}
				<Main className="generatedList-step primary-target">
					{shoppingList.length === 0 ? (
						<ImageContainer>
							<img src={images[currentImage]} alt="Random Vegetable" />
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
								setCopyLoader={setCopyLoader}
								totalProducts={totalProducts}
								totalReadyProduct={totalReadyProduct}
								newList={newList}
								newListId={newListId}
								listAboutToDelete={listAboutToDelete}
								deleteID={deleteID}
								setNewList={setNewList}
								setNewListId={setnewListId}
								newListB={newListB}
								setNewListB={setNewListB}
								setShare={setShare}
							/>
						</>
					)}

					{/* Notifications and List Loader */}
					<Notification message={message} status={status} />
					{loadingLists && <GetListLoader />}
					{copyLoader && <CopyListLoader />}
				</Main>
				{/* Footer / Sponsers | Components */}
				<Footer />
				{hiddenComp && <ShoppingList />}
			</Container>
		</ProductCountProvider>
	);
};

export default Home;
