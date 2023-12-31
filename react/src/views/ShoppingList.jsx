import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useLanguage } from '../contexts/LanguageContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears, faMagnifyingGlass, faXmark, faSquarePen } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/UI/Navbar';
import Notification from '../components/UI/Notification';
import Product from '../components/product/Product';
import RemoveProductOverlay from '../components/overlays/RemoveProductOverlay';
import ProductOvelay from '../components/overlays/ProductOvelay';
import RemoveProductLoader from '../components/loaders/RemoveProductLoader';
import MainSettings from '../components/UI/MainSettings';
import EmptyListOverlay from '../components/overlays/EmptyListOverlay';
import ReadyProduct from '../components/product/ReadyProduct';
import DeleteListAndProductOverlay from '../components/overlays/DeleteListAndProductOverlay';
import EmptyAndDeleteListLoader from '../components/loaders/EmptyAndDeleteListLoader';
import ProductEditOverlay from '../components/overlays/ProductEditOverlay';
import Pusher from 'pusher-js';
import Des1 from '../assets/des1.svg';
import Des3 from '../assets/des3.svg';
import Des4 from '../assets/des4.svg';
import Des5 from '../assets/des5.svg';

const Container = styled.div`
	width: 100%;
	min-height: 100vh;

	.inputLength {
		display: grid;
		place-items: center;
		min-width: 25px;
		max-width: 40px;
		font-size: 15px;
		margin-left: 5px;
		padding-right: 20px;
	}
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

const ImageContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	text-align: center;
	gap: 20px;
	z-index: 0;
	img {
		min-height: 300px;
		max-height: 300px;
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
			height: 30px;
			justify-content: space-between;

			.title {
				max-width: 350px;
				overflow: hidden;
				@media screen and (max-width: 750px) {
					max-width: 298px;
				}
			}
			.hidden-grp {
				display: flex;
				opacity: 0;
				height: 100%;
				align-items: center;
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
	}
	.header2 {
		margin-top: 50px;
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
const ShoppingList = ({}) => {
	//params for fast loading
	const navigate = useNavigate();
	const { id, listName } = useParams();
	const intervalIdRef = useRef(null);

	//theme
	const { darkMode } = useDarkMode();
	const { language, translate, translateProductNames } = useLanguage();

	//dynamic List Title
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [list, setList] = useState([]);
	const [title, setTitle] = useState(listName);
	//refs
	const inputRef = useRef(null);
	const searchRef = useRef(null);
	const [searchTerm, setSearchTerm] = useState('');

	//Notification Stats
	const [message, setMessage] = useState('');
	const [status, setStatus] = useState(200);
	const [selectedProducts, setSelectedProducts] = useState([]);

	//search State
	const [searching, setSearching] = useState(null);
	const [customProducts, setCustomProducts] = useState([]);

	//product Delete States
	const [productToRemove, setProductToRemove] = useState(null);
	const [productIDRemove, setProductIDRemove] = useState(null);
	const [removeProduct, setRemoveProduct] = useState(null);
	const [removeProductConfirmation, setRemoveProductConfirmation] = useState(null);
	const [productOverlay, setProductOverylay] = useState(false);
	const [hidden, setHidden] = useState(true);

	//state for the 3 types of products array
	//products to see what products have been marked
	const [product, setProduct] = useState([]);
	//state for the marked as ready products from the above state
	const [readyProducts, setReadyProducts] = useState([]);
	//state for the marked as To Buy products from the above state
	const [toBuyProducts, setToBuyProducts] = useState([]);

	const [openSettings, setOpenSettings] = useState(null);

	const [emptyList, setEmptyList] = useState(null);
	const [emptyAndDeleteListloader, setEmptyAndDeleteList] = useState(null);

	const [openEmptyListOverLay, setOpenEmptyListOverLay] = useState(null);
	const [openEmptyAndDeleteListOverLay, setOpenEmptyAndDeleteListOverlay] = useState(null);

	const [openEditProduct, setOpenEditProduct] = useState(false);
	const [productToEdit, setProductToEdit] = useState({});

	const maxNameLength = 20;
	const [nameLength, setNameLength] = useState('');
	const [currentImage, setCurrentImage] = useState(0);

	const images = [Des1, Des4, Des3, Des5];

	const startImageInterval = () => {
		const newIntervalId = setInterval(() => {
			const newIndex = Math.floor(Math.random() * images.length);
			setCurrentImage(newIndex);
		}, 3000);
		intervalIdRef.current = newIntervalId;
	};

	const checkNameLength = () => {
		setNameLength(inputRef.current.value.length);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			const listId = id;
			if (inputRef.current.value == '') {
				inputRef.current.value = 'list ' + listId;
			}
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
		const localList = JSON.parse(localStorage.getItem(`allProductsInList${id}`));
		const localReadyList = JSON.parse(localStorage.getItem(`readyProductsInList${id}`));
		const localToBuyList = JSON.parse(localStorage.getItem(`toBuyProductsInList${id}`));

		if (localList && localReadyList && localToBuyList && areListsEqual(localList, product)) {
			setProduct(localList);
			// Set The all Ready Array (if any)
			setReadyProducts(localReadyList);
			//set The To buy Array(if any)
			setToBuyProducts(localToBuyList);
			//set The selected products from the all products array for the products overlay
			setSelectedProducts(localList);
			return;
		} else {
			// Local list doesn't exist or is different, fetch from the API
			fetchListData();
		}
	};

	const fetchListData = () => {
		axiosClient
			.get(`/list/${id}`)
			.then((res) => {
				const products = res.data[1];
				const toBuy = products.filter((product) => product.status === 'to buy');
				const ready = products.filter((product) => product.status !== 'to buy');
				localStorage.setItem(`allProductsInList${id}`, JSON.stringify(products));
				localStorage.setItem(`toBuyProductsInList${id}`, JSON.stringify(toBuy));
				localStorage.setItem(`readyProductsInList${id}`, JSON.stringify(ready));
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
		const allLists = JSON.parse(localStorage.getItem('shoppingLists'));
		const sharedList = allLists.find((p) => p.id == id);
		if (sharedList && sharedList.shared == true && sharedList.link_url != null) {
			var pusher = new Pusher('9d3825eb76271a0fd1f7', {
				cluster: 'eu',
			});
			var channel = pusher.subscribe('shopping-list.' + sharedList.link_url);
			channel.bind('MarkedAsReady', (data) => {
				const thisUserId = localStorage.getItem('ACCESS_TOKEN');
				const userThatMarkedId = data.userId;
				if (thisUserId !== userThatMarkedId) {
					fetchListData();
				}
			});

			channel.bind('ProductAdded', (data) => {
				const thisUserId = localStorage.getItem('ACCESS_TOKEN');
				const userThatMarkedId = data.userId;
				if (thisUserId !== userThatMarkedId) {
					fetchListData();
				}
			});
			channel.bind('ProductDeleted', (data) => {
				const thisUserId = localStorage.getItem('ACCESS_TOKEN');
				const userThatMarkedId = data.userId;
				if (thisUserId !== userThatMarkedId) {
					fetchListData();
				}
			});
			channel.bind('ProductDeleted', (data) => {
				const thisUserId = localStorage.getItem('ACCESS_TOKEN');
				const userThatMarkedId = data.userId;

				if (thisUserId !== userThatMarkedId) {
					fetchListData();
				}
			});
			channel.bind('RemoveAllProducts', (data) => {
				const thisUserId = localStorage.getItem('ACCESS_TOKEN');
				const userThatMarkedId = data.userId;

				if (thisUserId !== userThatMarkedId) {
					fetchListData();
				}
			});
			channel.bind('MarkAllProductsReady', (data) => {
				const thisUserId = localStorage.getItem('ACCESS_TOKEN');
				const userThatMarkedId = data.userId;

				if (thisUserId !== userThatMarkedId) {
					fetchListData();
				}
			});
		}
		const inputElement = inputRef.current;
		if (isEditingTitle && inputElement) {
			inputElement.focus();
			inputElement.addEventListener('keypress', handleKeyPress);
			return () => {
				inputElement.removeEventListener('keypress', handleKeyPress);
			};
		}
		// Call updateList only when needed (e.g., when component mounts)
		fetchListData();
		startImageInterval();

		return () => {
			// Clear the interval when the component is unmounted
			if (intervalIdRef.current) {
				clearInterval(intervalIdRef.current);
			}
		};
	}, [isEditingTitle]);

	const editTitle = () => {
		setIsEditingTitle(true);
	};

	const saveTitle = (e) => {
		const newTitle = e.target.value.slice(0, 25);
		const idd = id;

		axiosClient
			.put(`/update-list-title/${idd}`, { title: newTitle })
			.then((res) => {
				setTitle(newTitle);
				// Update the title in local storage
				let allLists = localStorage.getItem('shoppingLists');
				allLists = JSON.parse(allLists) || [];
				const updatedLists = allLists.map((list) => {
					if (list.id == id) {
						return { ...list, name: newTitle };
					}
					return list;
				});
				// Save the updated data back to local storage
				localStorage.setItem('shoppingLists', JSON.stringify(updatedLists));

				setIsEditingTitle(false);
				setMessage(translate('notification-rename'));
				navigate(`/${newTitle}/${idd}`);
				setTimeout(() => {
					setMessage(null);
				}, 1600);
			})
			.catch((err) => {})
			.finally(() => {});
	};

	const handleOpenSearch = () => {
		const searchInput = searchRef.current;
		setSearching((prev) => !prev);
		setSearchTerm('');
		setTimeout(() => {
			searchInput.focus();
		}, 200);
		return;
	};

	const handleAddProduct = () => {
		setProductOverylay((prev) => !prev);
	};

	const closeSearch = () => {
		setSearchTerm('');
		setSearching((prev) => !prev);
	};

	const handleCloseProductOverlay = () => {
		setProductOverylay((prev) => !prev);
		setSearchTerm('');
	};

	const handleOpenSettings = () => {
		setOpenSettings((prev) => !prev);
	};

	const handleRemoveFromToBuy = (id) => {
		// Remove the product from toBuyProducts
		setToBuyProducts((prevToBuyProducts) => prevToBuyProducts.filter((toBuyProducts) => toBuyProducts.uniqueKey !== id));
	};

	const matchingReadyProducts = readyProducts.filter(
		(p) =>
			(p.name && p.name.mt && p.name.mt.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(p.name && p.name.en && p.name.en.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	const matchToBuyProducts = toBuyProducts.filter(
		(p) =>
			(p.name && p.name.mt && p.name.mt.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(p.name && p.name.en && p.name.en.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	const handleOn = () => {
		setHidden((prev) => !prev);
	};
	const handleOff = () => {
		setHidden((prev) => !prev);
	};

	const getMyProducts = () => {
		const userId = localStorage.getItem('ACCESS_TOKEN');
		const localCustomProduct = JSON.parse(localStorage.getItem('customItemsUser' + userId)) || [];

		setCustomProducts(localCustomProduct);

		axiosClient
			.get(`/custom-products/${userId}`)
			.then((res) => {
				const properCustom = localStorage.setItem('customItemsUser' + userId, JSON.stringify(res.data));
				setCustomProducts(res.data);
			})
			.catch((err) => {})
			.finally(() => {});
	};
	return (
		<Container className={darkMode ? 'darkMode final' : 'lightMode final'}>
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
						setProduct={setProduct}
						setSelectedProducts={setSelectedProducts}
						setOpenEmptyAndDeleteListOverlay={setOpenEmptyAndDeleteListOverlay}
						setMessage={setMessage}
					/>
				)}
				<ListHeader style={{ backgroundColor: darkMode ? 'black' : 'white' }}>
					<div className="top">
						<div onMouseEnter={handleOn} onMouseLeave={handleOff} onClick={editTitle} className="left">
							{!isEditingTitle ? (
								<>
									<p className="title" onClick={editTitle}>
										{title}
									</p>
									<div className="hidden-grp" style={{ opacity: hidden ? '' : '0.7' }}>
										<FontAwesomeIcon style={{ height: '80%' }} icon={faSquarePen} />
									</div>
								</>
							) : (
								<>
									<input
										style={{ color: darkMode ? '#fff' : '#000' }}
										maxLength={20}
										onBlur={saveTitle}
										defaultValue={title}
										ref={inputRef}
										onChange={checkNameLength}
									/>
									<FontAwesomeIcon style={{ height: '80%' }} icon={faSquarePen} />
									<p className="inputLength">{nameLength + '/' + maxNameLength}</p>
								</>
							)}
						</div>
						<input
							ref={searchRef}
							style={{ color: darkMode ? '#fff' : '#000', display: searching ? 'block' : 'none' }}
							className="search-input "
							placeholder="Search products..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<div className="right">
							{!searching && (
								<div onClick={handleOpenSearch} className="search large search-inList">
									<FontAwesomeIcon icon={faMagnifyingGlass} />
								</div>
							)}
							{searching && (
								<div onClick={closeSearch} className="search largest">
									<FontAwesomeIcon icon={faXmark} />
								</div>
							)}
							<div onClick={handleOpenSettings} className="settings larger settings-products">
								<FontAwesomeIcon icon={faGears} />
							</div>
						</div>
					</div>

					<div className="bottom"></div>
				</ListHeader>

				<ProductsContainer className="product-container">
					{toBuyProducts.length > 0 ? (
						toBuyProducts.length == 1 ? (
							<h2 className="header blue">{translate('to-buy')}</h2>
						) : (
							<h2 className="header blue">{translate('to-buy-plural')}</h2>
						)
					) : (
						''
					)}
					{toBuyProducts.length === 0 && readyProducts.length <= 0 ? (
						<ImageContainer>
							<img src={images[currentImage]} alt="Random Vegetable" />
							<h2 className="add-product bolder">{translate('please-add-product')}</h2>
						</ImageContainer>
					) : (
						toBuyProducts
							.filter(
								(p) =>
									(p.name && p.name.mt && p.name.mt.toLowerCase().includes(searchTerm.toLowerCase())) ||
									(p.name && p.name.en && p.name.en.toLowerCase().includes(searchTerm.toLowerCase()))
							)
							.map((p) => (
								<Product
									key={p.uniqueKey}
									wholeProduct={p}
									darkMode={darkMode}
									productKey={p.uniqueKey}
									setRemoveProduct={setRemoveProduct}
									setProductToRemove={setProductToRemove}
									productName={p.name[language]}
									price={p.price}
									quantity={p.quantity}
									unit={p.unit}
									setProductIDRemove={setProductIDRemove}
									item={product}
									listId={id}
									handleRemoveFromToBuy={handleRemoveFromToBuy}
									setReadyProducts={setReadyProducts}
									setProduct={setProduct}
									setToBuyProducts={setToBuyProducts}
									setSelectedProducts={setSelectedProducts}
									setOpenEditProduct={setOpenEditProduct}
									setProductToEdit={setProductToEdit}
									fetchListData={fetchListData}
								/>
							))
					)}
					{searchTerm.trim() !== '' && toBuyProducts.length > 0 && matchToBuyProducts == 0 && (
						<p>{translate('no-products-found-to-buy')}</p>
					)}

					{/* Ready Products */}
					{readyProducts.length > 0 ? (
						readyProducts.length === 1 ? (
							<h2 className="header2 header green">{translate('ready-product')}</h2>
						) : (
							<h2 className="header header2 green">{translate('ready-product-plural')}</h2>
						)
					) : (
						''
					)}

					{matchingReadyProducts.length > 0
						? matchingReadyProducts.map((p) => (
								<ReadyProduct
									key={p.uniqueKey}
									item={p}
									setRemoveProduct={setRemoveProduct}
									setProductToRemove={setProductToRemove}
									setProductIDRemove={setProductIDRemove}
									updateList={updateList}
								/>
						  ))
						: searchTerm.trim() !== '' && readyProducts.length != 0 && <p>{translate('no-products-found-ready')}</p>}
				</ProductsContainer>

				{/* Notifications, Overlays, loaders, Floating Butttons  translate("no-products-found-ready")*/}
				<Notification message={message} status={status} />

				{/* All Products OverLay */}
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
						setOpenEditProduct={setOpenEditProduct}
						setProductToEdit={setProductToEdit}
						setMessage={setMessage}
						customProducts={customProducts}
						setCustomProducts={setCustomProducts}
					/>
				)}

				{/* Edit Product Overlay */}
				{openEditProduct && (
					<ProductEditOverlay
						productToEdit={productToEdit}
						setOpenEditProduct={setOpenEditProduct}
						item={product}
						listId={id}
						updateList={updateList}
						getMyProducts={getMyProducts}
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
						updateList={updateList}
					/>
				)}

				{/* Empty The List From Product and Loader */}
				{openEmptyListOverLay && (
					<EmptyListOverlay
						title={title}
						setOpenEmptyListOverLay={setOpenEmptyListOverLay}
						setEmptyList={setEmptyList}
						listId={id}
						updateList={updateList}
					/>
				)}

				{/* Empty and delete list overlay and loader */}
				{openEmptyAndDeleteListOverLay && (
					<DeleteListAndProductOverlay
						title={title}
						setOpenEmptyAndDeleteListOverlay={setOpenEmptyAndDeleteListOverlay}
						setEmptyList={setEmptyList}
						listId={id}
						updateList={updateList}
						setEmptyAndDeleteList={setEmptyAndDeleteList}
					/>
				)}
				{emptyAndDeleteListloader && <EmptyAndDeleteListLoader />}

				{/* When Product OverLay is Open Display The Close Button else Add ProductButton*/}
				{!productOverlay && (
					<div className="background" style={{ backgroundColor: darkMode ? '#1C1C1D' : '#f5f5f5' }}>
						<Addbutton
							onClick={handleAddProduct}
							className="btn add-products-button"
							style={{ color: darkMode ? 'white' : 'black', borderColor: darkMode ? 'white' : 'black' }}
						>
							{translate('product-add-btn')}
						</Addbutton>
					</div>
				)}
				{productOverlay && (
					<Closebutton
						onClick={handleCloseProductOverlay}
						className="btn close-btn"
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
