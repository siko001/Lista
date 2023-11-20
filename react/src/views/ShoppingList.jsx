import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useLanguage } from '../contexts/LanguageContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import Product from '../components/Product';
import RemoveProductOverlay from '../components/RemoveProductOverlay';
import ProductOvelay from '../components/ProductOvelay';
import RemoveProductLoader from '../components/RemoveProductLoader';
import MainSettings from '../components/MainSettings';
import EmptyListOverlay from '../components/EmptyListOverlay';
import ReadyProduct from '../components/ReadyProduct';

const Container = styled.div`
	width: 100%;
	min-height: 100vh;
`;

const Main = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;

	.background {
		height: 80px;
		border-radius: 10px 10px 0 0;
		width: 100%;
		position: fixed;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;

const ListHeader = styled.div`
	position: sticky;
	top: -1px;
	overflow: hidden;
	margin: 0 auto;
	width: 45%;
	height: 100px;
	z-index: 1;
	padding: 0 15px;
	border-radius: 0px 0px 30px 30px;
	margin-bottom: 20px;
	padding-bottom: 20px;
	display: flex;
	flex-direction: column;
	@media screen and (max-width: 950px) {
		width: 95%;
	}

	.top {
		position: relative;
		display: flex;
		flex: 1;
		justify-content: space-between;
		align-items: center;

		.left {
			font-weight: 700;
			font-size: 1.2rem;
			margin: 0 20px 0 0px;
			width: 100%;
			padding-left: 10px;
			display: flex;
			align-items: center;
			height: 20px;

			.title {
				max-width: 350px;
				overflow: hidden;
				@media screen and (max-width: 750px) {
					max-width: 298px;
				}
			}
		}
		.left:hover {
			border-radius: 5px;
			background-color: #a2a2a238;
			cursor: pointer;
		}

		input {
			background-color: transparent;
			border: none;
			outline: none;
			width: 100%;
			cursor: pointer;
		}

		.search,
		.settings {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 40px;
			height: 40px;
			border-radius: 50%;
		}

		.search:hover,
		.settings:hover {
			cursor: pointer;
			background-color: #80808044;
		}

		.search-input {
			border-bottom: 1px solid;
			max-width: 40%;
			margin-left: -10px;
			margin-right: 10px;
			font-size: 1.2rem;
		}

		.right {
			margin-right: 15px;
			width: 60px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 10px;

			.quantity {
				font-size: 0.8rem;
				color: gray;
			}
		}
	}
	.bottom {
		width: 100%;
		min-height: 8px;
		border-radius: 5px;
		background-color: #a2a2a238;
		margin: 0 auto;
	}
`;

const ProductsContainer = styled.div`
	align-items: center;
	margin: 0 auto;
	width: 45%;
	display: flex;
	flex-direction: column;
	margin-bottom: 100px;
	@media screen and (max-width: 950px) {
		min-width: 100%;
		max-width: 100vw;
		overflow: auto;
	}
	.header {
		margin-bottom: 10px;
		font-weight: 600;
		&:nth-child(2n) {
			margin-top: 40px;
		}
	}
`;

const Addbutton = styled.button`
	padding: 1rem 1.5rem;
	background: #0a6bdb;
	font-size: 1rem;
	font-weight: 600;
	border: none;
	&:hover {
		background: #0a6cdbbb;
		border: 1px solid;
	}
`;

const Closebutton = styled.button`
	position: fixed;
	z-index: 999;
	bottom: 20px;
	padding: 1rem 1.5rem;
	background: #db0a1f;
	font-size: 1rem;
	font-weight: 600;
	border: none;
	&:hover {
		background: #db0a1fbb;
		border: 1px solid;
	}
`;
const ShoppingList = () => {
	//params for fast loading
	const navigate = useNavigate();
	const { id, listName } = useParams();
	//theme
	const { darkMode } = useDarkMode();
	const { translate } = useLanguage();

	//dynamic List Title
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [list, setList] = useState([]);
	const [title, setTitle] = useState(listName);
	//refs
	const inputRef = useRef(null);
	const searchRef = useRef(null);

	//Notification Stats
	const [message, setMessage] = useState('');
	const [status, setStatus] = useState(200);
	const [selectedProducts, setSelectedProducts] = useState([]);

	//search State
	const [searching, setSearching] = useState(null);

	//product Delete States
	const [productToRemove, setProductToRemove] = useState(null);
	const [productIDRemove, setProductIDRemove] = useState(null);
	const [removeProduct, setRemoveProduct] = useState(null);
	const [removeProductConfirmation, setRemoveProductConfirmation] = useState(null);
	const [productOverlay, setProductOverylay] = useState(false);

	//state for the 3 types of products array
	//products to see what products have been marked
	const [product, setProduct] = useState([]);
	//state for the marked as ready products from the above state
	const [readyProducts, setReadyProducts] = useState([]);
	//state for the marked as To Buy products from the above state
	const [toBuyProducts, setToBuyProducts] = useState([]);

	const [openSettings, setOpenSettings] = useState(null);

	const [emptyList, setEmptyList] = useState(null);
	const [openEmptyListOverLay, setOpenEmptyListOverLay] = useState(null);

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			saveTitle(e);
		}
	};

	const areListsEqual = (listA, listB) => {
		if (!listA || !listB) {
			return false;
		}

		// Compare individual properties
		return listA.id === listB.id;
	};
	const updateList = () => {
		// const localList = JSON.parse(localStorage.getItem(`allProductsInList${id}`));
		// const localReadyList = JSON.parse(localStorage.getItem(`readyProductsInList${id}`));
		// const localToBuyList = JSON.parse(localStorage.getItem(`toBuyProductsInList${id}`));

		// if (localList && localReadyList && localToBuyList && areListsEqual(localList, product)) {
		// 	fetchListData();
		// 	console.log('local storage and db are the same');
		// } else {
		// Local list doesn't exist or is different, fetch from the API
		// console.log('db and local are not the same');
		fetchListData();
	};

	const fetchListData = () => {
		axiosClient
			.get(`/list/${id}`)
			.then((res) => {
				const products = res.data[1];
				const toBuy = products.filter((product) => product.status === 'to buy');
				const ready = products.filter((product) => product.status !== 'to buy');

				// localStorage.setItem(`allProductsInList${id}`, JSON.stringify(products));
				// localStorage.setItem(`toBuyProductsInList${id}`, JSON.stringify(toBuy));
				// localStorage.setItem(`readyProductsInList${id}`, JSON.stringify(ready));
				//set the all Products Array
				setProduct(products);
				// Set The all Ready Array (if any)
				setReadyProducts(ready);
				//set The To buy Array(if any)
				setToBuyProducts(toBuy);
				//set The selected products from the all products array for the products overlay
				setSelectedProducts(products);
			})
			.catch((error) => {
				console.error('Error fetching list:', error);
			})
			.finally(() => {});
	};

	useEffect(() => {
		const inputElement = inputRef.current;
		if (isEditingTitle && inputElement) {
			inputElement.focus();
			inputElement.addEventListener('keypress', handleKeyPress);
			return () => {
				inputElement.removeEventListener('keypress', handleKeyPress);
			};
		}
		// Call updateList only when needed (e.g., when component mounts)
		updateList();
	}, [isEditingTitle]);

	const editTitle = () => {
		setIsEditingTitle(true);
		const titleInput = inputRef.current;
		setTimeout(() => {
			titleInput.focus();
		}, 200);
	};

	const saveTitle = (e) => {
		const newTitle = e.target.value.slice(0, 25);
		const idd = id;

		axiosClient
			.put(`/update-list-title/${idd}`, { title: newTitle })
			.then((res) => {
				setTitle(newTitle);
				// Update the title in local storage
				// let allLists = localStorage.getItem('shoppingLists');
				// // Assuming allLists is a string representation of JSON data, parse it into an array
				// allLists = JSON.parse(allLists) || [];
				// const updatedLists = allLists.map((list) => {
				// 	if (list.id == id) {
				// 		// Update the title for the matching list
				// 		return { ...list, name: newTitle };
				// 	}
				// 	return list;
				// });
				// // Save the updated data back to local storage
				// localStorage.setItem('shoppingLists', JSON.stringify(updatedLists));

				setIsEditingTitle(false);
				setMessage(translate('notification-rename'));
				navigate(`/${newTitle}/${idd}`);
				setTimeout(() => {
					setMessage(null);
				}, 1600);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {});
	};

	const handleOpenSearch = () => {
		const searchInput = searchRef.current;
		setSearching((prev) => !prev);
		setTimeout(() => {
			searchInput.focus();
		}, 200);
		return;
	};

	const handleAddProduct = () => {
		setProductOverylay((prev) => !prev);
	};

	const closeSearch = () => {
		setSearching((prev) => !prev);
	};

	const handleCloseProductOverlay = () => {
		setProductOverylay((prev) => !prev);
	};

	const handleOpenSettings = () => {
		setOpenSettings((prev) => !prev);
	};

	const handleRemoveFromToBuy = (id) => {
		// Remove the product from toBuyProducts
		setToBuyProducts((prevToBuyProducts) => prevToBuyProducts.filter((toBuyProducts) => toBuyProducts.uniqueKey !== id));
	};

	return (
		<Container className={darkMode ? 'darkMode' : 'lightMode'}>
			<Navbar />
			<Main>
				{openSettings && (
					<MainSettings
						setOpenSettings={setOpenSettings}
						editTitle={editTitle}
						setOpenEmptyListOverLay={setOpenEmptyListOverLay}
						product={product}
						readyProducts={readyProducts}
						listId={id}
						updateList={updateList}
						toBuyProducts={toBuyProducts}
						setToBuyProducts={setToBuyProducts}
						setReadyProducts={setReadyProducts}
					/>
				)}
				<ListHeader style={{ backgroundColor: darkMode ? 'black' : 'white' }}>
					<div className="top">
						<div onClick={editTitle} className="left">
							{!isEditingTitle ? (
								<p className="title" onClick={editTitle}>
									{title}{' '}
								</p>
							) : (
								<input
									style={{ color: darkMode ? '#fff' : '#000' }}
									maxLength={20}
									onBlur={saveTitle}
									defaultValue={title}
									ref={inputRef}
								/>
							)}
						</div>
						<input
							ref={searchRef}
							onBlur={closeSearch}
							style={{ color: darkMode ? '#fff' : '#000', display: searching ? 'block' : 'none' }}
							className="search-input"
						/>
						<div className="right">
							{!searching && (
								<div onClick={handleOpenSearch} className="search">
									<FontAwesomeIcon icon={faMagnifyingGlass} />
								</div>
							)}
							<div onClick={handleOpenSettings} className="settings">
								<FontAwesomeIcon icon={faGears} />
							</div>
						</div>
					</div>

					<div className="bottom"></div>
				</ListHeader>

				<ProductsContainer>
					{toBuyProducts.length > 0 ? (
						toBuyProducts.length == 1 ? (
							<h2 className="header blue">{translate('to-buy')}</h2>
						) : (
							<h2 className="header blue">{translate('to-buy-plural')}</h2>
						)
					) : (
						''
					)}
					{toBuyProducts.length === 0 && readyProducts.length <= 0
						? translate('please-add-product')
						: toBuyProducts.map((p) => (
								<Product
									key={p.name}
									darkMode={darkMode}
									productKey={p.uniqueKey}
									setRemoveProduct={setRemoveProduct}
									setProductToRemove={setProductToRemove}
									productName={p.name}
									price={p.price}
									quantity={p.quantity}
									unit={p.unit}
									setProductIDRemove={setProductIDRemove}
									setReadyProducts={setReadyProducts}
									setProduct={setProduct}
									item={product}
									listId={id}
									handleRemoveFromToBuy={handleRemoveFromToBuy}
								/>
						  ))}

					{/* Ready Products */}
					{readyProducts != 0 ? (
						readyProducts.length == 1 ? (
							<h2 className="header  green">{translate('ready-product')}</h2>
						) : (
							<h2 className="header green">{translate('ready-product-plural')}</h2>
						)
					) : (
						''
					)}

					{Array.isArray(readyProducts) && readyProducts.map((p) => <ReadyProduct key={product.uniqueKey} item={p} />)}
				</ProductsContainer>

				{/* Notifications, Overlays, loaders, Floating Butttons */}
				<Notification message={message} status={status} />

				{/* All Prodcts OverLay */}
				{productOverlay && (
					<ProductOvelay
						darkMode={darkMode}
						setProduct={setProduct}
						id={id}
						updateList={updateList}
						selectedProducts={selectedProducts}
						setSelectedProducts={setSelectedProducts}
						toBuyProducts={toBuyProducts}
						setToBuyProducts={setToBuyProducts}
						readyProducts={readyProducts}
						setReadyProducts={setReadyProducts}
					/>
				)}

				{/* Remove Product Overlay & loader */}
				{(removeProductConfirmation || emptyList) && <RemoveProductLoader />}
				{removeProduct && (
					<RemoveProductOverlay
						productToRemove={productToRemove}
						listTitle={title}
						setRemoveProduct={setRemoveProduct}
						setProduct={setProduct}
						listId={id}
						productIDRemove={productIDRemove}
						setMessage={setMessage}
						setStatus={setStatus}
						setRemoveProductConfirmation={setRemoveProductConfirmation}
					/>
				)}

				{openEmptyListOverLay && (
					<EmptyListOverlay
						title={title}
						setOpenEmptyListOverLay={setOpenEmptyListOverLay}
						setEmptyList={setEmptyList}
						listId={id}
						updateList={updateList}
					/>
				)}

				{/* When Product OverLay is Open Display The Close Button else Add ProductButton*/}
				{!productOverlay && (
					<div className="background" style={{ backgroundColor: darkMode ? '#1C1C1D' : '#f5f5f5' }}>
						<Addbutton
							onClick={handleAddProduct}
							className="btn"
							style={{ color: darkMode ? 'white' : 'black', borderColor: darkMode ? 'white' : 'black' }}
						>
							{translate('product-add-btn')}
						</Addbutton>
					</div>
				)}
				{productOverlay && (
					<Closebutton
						onClick={handleCloseProductOverlay}
						className="btn"
						style={{ color: darkMode ? 'white' : 'black', borderColor: darkMode ? 'red' : 'red' }}
					>
						{translate('product-close-btn')}
					</Closebutton>
				)}
			</Main>
		</Container>
	);
};

export default ShoppingList;
