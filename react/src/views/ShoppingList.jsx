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

const Container = styled.div`
	width: 100%;
	min-height: 100vh;
`;

const Main = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`;

const ListHeader = styled.div`
	margin: 0 auto;
	width: 45%;
	height: 100px;
	padding-bottom: 20px;
	display: flex;
	flex-direction: column;
	@media screen and (max-width: 950px) {
		width: 90%;
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
	@media screen and (max-width: 950px) {
		min-width: 100%;
		max-width: 100vw;
	}
`;

const Addbutton = styled.button`
	position: fixed;
	bottom: 40px;
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

	//search State
	const [searching, setSearching] = useState(null);

	//product Delete States
	const [productToRemove, setProductToRemove] = useState(null);
	const [productIDRemove, setProductIDRemove] = useState(null);
	const [removeProduct, setRemoveProduct] = useState(null);

	const [productOverlay, setProductOverylay] = useState(false);
	const [product, setProduct] = useState([]);

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			saveTitle(e);
		}
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

		axiosClient
			.get(`/list/${id}`, id)
			.then((res) => {
				setList(res.data[0]);
				setProduct(res.data[1]);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {});
	}, [id, isEditingTitle, product]);

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

	return (
		<Container className={darkMode ? 'darkMode' : 'lightMode'}>
			<Navbar />
			<Main>
				<ListHeader>
					<div className="top">
						<div onClick={editTitle} className="left">
							{!isEditingTitle ? (
								<p onClick={editTitle}>{title} </p>
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
							<div className="settings">
								<FontAwesomeIcon icon={faGears} />
							</div>
						</div>
					</div>
					<div className="bottom"></div>
				</ListHeader>

				<ProductsContainer>
					{product.length === 0
						? translate('please-add-product')
						: product.map((product) => (
								<Product
									key={product.id}
									darkMode={darkMode}
									setRemoveProduct={setRemoveProduct}
									setProductToRemove={setProductToRemove}
									productName={product.name}
									price={product.price}
									quantity={product.quantity}
									unit={product.unit}
								/>
						  ))}
				</ProductsContainer>

				{/* Notifications, Overlays, loaders, Floating Butttons */}
				<Notification message={message} status={status} />
				{productOverlay && <ProductOvelay darkMode={darkMode} setProduct={setProduct} id={id} />}

				{removeProduct && (
					<RemoveProductOverlay
						productToRemove={productToRemove}
						listTitle={title}
						setRemoveProduct={setRemoveProduct}
						setProduct={setProduct}
					/>
				)}

				{!productOverlay && (
					<Addbutton
						onClick={handleAddProduct}
						className="btn"
						style={{ color: darkMode ? 'white' : 'black', borderColor: darkMode ? 'white' : 'black' }}
					>
						{translate('product-add-btn')}
					</Addbutton>
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
