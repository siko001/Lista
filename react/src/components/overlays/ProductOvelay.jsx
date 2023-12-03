import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PopularProducts from '../../PopularProducts';
import axiosClient from '../../axiosClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import DeleteCustomProduct from './DeleteCustomProduct';
import GetListLoader from '../loaders/GetListLoader';

const Container = styled.div`
	z-index: 999;
	color: #fff;
	position: absolute;
	top: 0;
	min-height: 100vh;
	width: 100%;
	max-width: 100vw;
	position: fixed;

	.top {
		height: 20px;
		position: absolute;
		width: 85%;
		&:hover {
			cursor: pointer;
		}
	}
	.bottom {
		position: absolute;
		margin-top: -20px;
		width: 85%;
		height: 20px;
		&:hover {
			cursor: pointer;
		}
	}

	.custom-item {
		width: 100%;

		@media screen and (max-width: 650px) {
			max-width: 150px;
			overflow: hidden;
		}
		input {
			border: 1px solid;
			width: 20px;
			height: 20px;
		}
	}

	.center-div {
		min-height: 370px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.custom-grp {
		margin: 0 0 20px;
		width: 100%;
		input {
			min-width: 60%;
			max-width: 200px;
			height: 35px;
			padding-left: 10px;
			outline: none;
			@media screen and (max-width: 650px) {
				max-width: 60%;
			}
		}
		button {
			height: 36px;
			padding: 0.35rem 0.65rem;
			background-color: #110ae3;
			color: inherit;
			font-size: 0.9rem;
			font-weight: 600;
			border-radius: 2px;
		}
	}
	.name {
		min-width: 200px;
		overflow: hidden;

		@media screen and (max-width: 750px) {
			min-width: 170px;
			wdith: 160px;
			max-width: 160px;
			font-size: 0.9rem;
		}
	}

	.category {
		font-size: 0.8rem;
		min-width: 70px;
	}

	.grp {
		display: flex;
		align-items: center;
		width: 100px;
		padding-bottom: 6px;
	}
	.narrow {
		justify-content: end;
		gap: 20px;
		align-items: end;
		font-size: 1.2rem;
	}
	.trash {
	}
	.trash:hover {
		color: red;
	}

	.remove {
		display: grid;
		place-items: center;
		width: 25px;
		height: 25px;
		border-radius: 50%;
	}
	.remove:hover {
		color: yellow;
		border: 1px solid yellow;
	}

	nav {
		width: 100%;
		display: flex;
		gap: 10px;
		font-weight: 600;
		@media screen and (max-width: 500px) {
			gap: 5px;
			font-size: 0.8rem;
			font-weight: 600;
			text-align: center;
		}

		.nav-item {
			margin: 8px 0;
			padding-bottom: 10px;

			&:hover {
				border-bottom: 1px solid #120aff;
				cursor: pointer;
			}
		}
	}
	.selected {
		color: #110ae3;
	}
`;

const SearchInput = styled.input`
	margin: 0 auto;
	display: flex;
	margin-top: 30px;
	width: 40%;
	border-radius: 10px;
	height: 45px;
	padding-left: 10px;
	font-size: 1rem;
	font-weight: 600;
	@media screen and (max-width: 950px) {
		width: 90%;
	}
`;

const Main = styled.div`
	display: flex;
	border: 1px solid black;
	flex-direction: column;
	width: 40%;
	margin: 0 auto;
	margin-top: 20px;
	border-radius: 10px;

	@media screen and (max-width: 950px) {
		width: 90%;
	}

	.addProduct {
		width: 50%;
		margin: 0 auto;
		min-height: 25px;
	}
`;

const ProductTable = styled.div`
	width: 95%;
	margin: 10px auto;
	border-radius: 5px;
	overflow: auto;
	gap: 4px;
	display: flex;
	flex-direction: column;

	/* Styling the scrollbar */
	&::-webkit-scrollbar {
		width: 10px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #888;
		border-radius: 6px;
	}

	&::-webkit-scrollbar-track {
		background-color: #f1f1f1;
		border-radius: 6px;
	}
	@media screen and (max-height: 1100px) {
		max-height: 890px;
	}
	@media screen and (max-height: 1050px) {
		max-height: 840px;
	}
	@media screen and (max-height: 1000px) {
		max-height: 790px;
	}
	@media screen and (max-height: 950px) {
		max-height: 660px;
	}
	@media screen and (max-height: 900px) {
		max-height: 630px;
	}
	@media screen and (max-height: 850px) {
		max-height: 580px;
	}
	@media screen and (max-height: 750px) {
		max-height: 470px;
	}
	@media screen and (max-height: 740px) {
		max-height: 490px;
	}
	@media screen and (max-height: 700px) {
		max-height: 410px;
	}
`;

const ProductRow = styled.div`
	min-width: 100%;
	border-radius: 10px;

	.categoryRow {
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 18px;
	}
`;

const ProductCell = styled.div`
	display: flex;
	padding: 10px 20px;
	align-items: center;
	justify-content: space-between;
	@media screen and (max-width: 750px) {
		padding: 10px 2px;
	}

	&:hover {
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 8px;
	}
	p {
		margin-right: 10px;
		&:hover {
			cursor: pointer;
		}
	}

	.grp-check {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.radio {
		height: 20px;
		width: 20px;

		&:hover {
			cursor: pointer;
		}
	}
`;

const ProductFilter = styled.select`
	border: 1px solid;
	width: 100%;
	margin-top: -4px;
	height: 35px;
	border-radius: 10px 0 5px;
	font-weight: 600;
`;

const ProductFilterButton = styled.option`
	margin: 0 10px;
	padding: 10px;
	font-weight: 600;
	cursor: pointer;
	background-color: ${(props) => (props.active ? '#aaa' : 'transparent')};
`;

const ProductOverlay = ({
	darkMode,
	setProduct,
	id,
	updateList,
	selectedProducts,
	setSelectedProducts,
	toBuyProducts,
	setOpenEditProduct,
	setProductToEdit,
}) => {
	const [selected, setSelected] = useState('Popular Products');
	const [selectedFilter, setSelectedFilter] = useState('random');
	const [customItemNameValid, setCustomItemNameValid] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const userId = localStorage.getItem('ACCESS_TOKEN');
	const [customProducts, setCustomProducts] = useState([]);
	const [customProductToDelete, setCustomProductToDelete] = useState();
	const englishNameRef = useRef();
	const malteseNameRef = useRef();
	const [customListLoading, setCustomListLoading] = useState(false);
	const { language, translate, translateProductNames } = useLanguage();
	const listId = id;

	useEffect(() => {
		// Load the list of selected products from local storage
		// console.log(toBuyProducts);
		// const storedProducts = JSON.parse(localStorage.getItem(`allProductsInList` + id)) || [];
		setSelectedProducts(selectedProducts);
		getMyProducts();
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, []);

	const handleFilterChange = (event) => {
		const filter = event.target.value;
		setSelectedFilter(filter);
	};

	const handleNavItemClick = (itemName) => {
		setSelected(itemName);
	};

	const handleSelect = (product) => {
		const productId = product.uniqueKey;
		// Check if the product is already selected
		if (selectedProducts.some((selectedProduct) => selectedProduct.uniqueKey == productId)) {
			return;
		}

		// Update the list of selected products
		const updatedSelectedProducts = [...selectedProducts, product];
		setSelectedProducts(updatedSelectedProducts);

		// // Update local storage
		const allLists = JSON.parse(localStorage.getItem(`shoppingLists`)) || [];

		const correctList = allLists.find((list) => list.id == listId);
		// Update the count
		correctList.totalProductCount++;
		localStorage.setItem('shoppingLists', JSON.stringify(allLists));

		const updatedLists = allLists.map((list) => {
			if (list.id == listId) {
				// Find the list by ID and add the product to its products array
				const allProducts = JSON.parse(localStorage.getItem(`allProductsInList` + listId)) || [];

				const toBuyProducts = JSON.parse(localStorage.getItem(`toBuyProductsInList` + listId)) || [];

				const updatedProducts = [...allProducts, product];
				const updatedToBuyProducts = [...toBuyProducts, product]; // Add the new product to the existing products

				localStorage.setItem(`allProductsInList` + listId, JSON.stringify(updatedProducts));
				localStorage.setItem(`toBuyProductsInList` + listId, JSON.stringify(updatedToBuyProducts));
			}
			return list;
		});

		// Save the updated data back to local storage
		localStorage.setItem(`shoppingLists`, JSON.stringify(updatedLists));
		const userId = localStorage.getItem('ACCESS_TOKEN');

		axiosClient
			.post(`/add-product/${product.name[language]}/${userId}`, [listId, product])
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {});

		setProduct((prevProducts) => [...prevProducts, product]);
		updateList();
	};

	const getMyProducts = () => {
		const userId = localStorage.getItem('ACCESS_TOKEN');
		axiosClient
			.get(`/custom-products/${userId}`)
			.then((res) => {
				setCustomProducts(res.data);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {});
	};

	const handleUnselectProduct = (productId, listId) => {
		// // Update local storage
		const allLists = JSON.parse(localStorage.getItem(`shoppingLists`)) || [];

		const correctList = allLists.find((list) => list.id == listId);
		// Update the count
		correctList.totalProductCount--;
		localStorage.setItem('shoppingLists', JSON.stringify(allLists));

		//unselecet from the all products
		const selectedProducts = JSON.parse(localStorage.getItem(`allProductsInList${listId}`)) || [];
		const updatedSelectedProducts = selectedProducts.filter((product) => product.uniqueKey !== productId);
		localStorage.setItem(`allProductsInList${listId}`, JSON.stringify(updatedSelectedProducts));

		//unselect from the to buy
		const selectedToBuyProducts = JSON.parse(localStorage.getItem(`toBuyProductsInList${listId}`)) || [];
		const updatedSelectedToBuyProducts = selectedToBuyProducts.filter((product) => product.uniqueKey !== productId);
		localStorage.setItem(`toBuyProductsInList${listId}`, JSON.stringify(updatedSelectedToBuyProducts));

		//unselect from the ready localstorage
		const selectedReadyProducts = JSON.parse(localStorage.getItem(`readyProductsInList${listId}`)) || [];
		const updatedSelectedReadyProducts = selectedReadyProducts.filter((product) => product.uniqueKey !== productId);
		localStorage.setItem(`readyProductsInList${listId}`, JSON.stringify(updatedSelectedReadyProducts));
		setSelectedProducts(updatedSelectedProducts);

		axiosClient
			.delete(`remove-product/${productId}/${listId}`)
			.then((res) => {
				console.log(res);
				updateList();
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {});
	};

	//continue down here
	const addProductRequest = (userId, name, lang) => {
		if (lang == 'mt') {
			const data = {
				nameEn: '',
				nameMt: name,
			};
			setCustomListLoading(true);
			axiosClient
				.post(`/create-myProduct/${userId}`, data)
				.then((res) => {
					console.log(res);

					// update the local storage
					getMyProducts();
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setCustomListLoading(false);
				});
		} else {
			const data = {
				nameEn: name,
				nameMt: '',
			};
			setCustomListLoading(true);

			axiosClient
				.post(`/create-myProduct/${userId}`, data)
				.then((res) => {
					console.log(res);
					getMyProducts();
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setCustomListLoading(false);
				});
		}
	};

	const handleDeleteCustomItem = (customItem, userId) => {
		setCustomProductToDelete(customItem);
	};

	const handleAddEnglishProduct = (english) => {
		const productName = englishNameRef.current.value;
		addProductRequest(userId, productName, english);
		englishNameRef.current.value = '';
		setCustomItemNameValid(false);
	};

	const handleAddMalteseProduct = (maltese) => {
		const productName = malteseNameRef.current.value;
		addProductRequest(userId, productName, maltese);
		malteseNameRef.current.value = '';
		setCustomItemNameValid(false);
	};

	const handleAddEnglishCustomValidity = () => {
		console.log(englishNameRef);
		if (englishNameRef.current.value.length >= 3) {
			setCustomItemNameValid(true);
		} else {
			setCustomItemNameValid(false);
		}
	};

	const handleAddMalteseCustomValidity = () => {
		if (malteseNameRef.current.value.length >= 3) {
			setCustomItemNameValid(true);
		} else {
			setCustomItemNameValid(false);
		}
	};

	const handleEditCustomItem = (item) => {
		console.log(item.name);
		setOpenEditProduct((prev) => !prev);
		setProductToEdit(item);
	};

	return (
		<Container style={{ backgroundColor: darkMode ? 'rgb(0,0,0)' : 'rgb(255,255,255)' }}>
			<SearchInput
				placeholder={translate('placeholder-example')}
				style={{
					backgroundColor: darkMode ? 'rgba(43, 43, 43, 1)' : '#bcbcbc',
					color: darkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)',
					border: darkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)',
				}}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			></SearchInput>
			<Main
				style={{
					backgroundColor: darkMode ? 'rgba(43, 43, 43, 1)' : '#bcbcbc',
					color: darkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)',
					border: darkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)',
				}}
			>
				<nav>
					<div className="grp">
						<ProductFilter onChange={handleFilterChange}>
							<ProductFilterButton value="random" active={selectedFilter.toString(selectedFilter === 'random')}>
								{translate('random')}
							</ProductFilterButton>
							<ProductFilterButton value="category" active={selectedFilter.toString(selectedFilter === 'random')}>
								{translate('by-category')}
							</ProductFilterButton>
							{/* Add more filter buttons for future filters */}
						</ProductFilter>
					</div>

					{/* Navigation Between PreSet Items and User Items */}
					{/* Preassigned */}
					<div
						className={`nav-item ${selected === 'Popular Products' ? 'selected' : ''}`}
						onClick={() => handleNavItemClick('Popular Products')}
					>
						{translate('popular-products')}
					</div>

					{/* User Inputted Items */}
					<div
						className={`nav-item ${selected === 'My Products' ? 'selected' : ''}`}
						onClick={() => handleNavItemClick('My Products')}
					>
						{translate('user-products')}
					</div>
				</nav>

				{selected === 'Popular Products' && (
					// Category Is Set At Random
					<ProductTable>
						{selectedFilter === 'random' &&
							PopularProducts.filter((product) => {
								const translatedName = product.name[language] || product.name.en;
								return translatedName.toLowerCase().includes(searchTerm.toLowerCase());
							}).map((product) => (
								<ProductRow key={product.uniqueKey}>
									<ProductCell>
										<div className="grp-check boldest">
											<input
												className="radio"
												onChange={() => handleSelect(product)}
												type="checkbox"
												checked={selectedProducts.some(
													(selectedProduct) => selectedProduct.uniqueKey == product.uniqueKey
												)}
											/>
											<p className="name large">{product.name[language] || product.name.en}</p>
										</div>
										<p className="category lighter">{product.category[language] || product.category.en}</p>
										<p
											onClick={() => {
												const sameProduct = toBuyProducts.some((p) => p.uniqueKey === product.uniqueKey);

												if (sameProduct) {
													handleUnselectProduct(product.uniqueKey, listId);
												} else {
													return;
												}
											}}
										>
											<FontAwesomeIcon icon={faXmark} />
										</p>
									</ProductCell>
								</ProductRow>
							))}

						{/* If Selected is by Category */}
						{selectedFilter === 'category' &&
							Array.from(new Set([...PopularProducts].map((product) => product.category[language]))).map(
								(category, categoryIndex) => (
									<React.Fragment key={categoryIndex}>
										<ProductRow className="categoryRow">
											<ProductCell
												style={{
													fontWeight: 'bold',
													color: '#057753',
													backgroundColor: '#00000033',
												}}
											>
												{category}
											</ProductCell>
										</ProductRow>
										{PopularProducts.map((product, productIndex) => {
											if (
												product.category[language] === category &&
												product.name[language] &&
												product.name[language] &&
												product.name[language].toLowerCase().includes(searchTerm.toLowerCase())
											) {
												return (
													<ProductRow key={product.uniqueKey}>
														<ProductCell>
															<div className="grp-check boldest">
																<input
																	className="radio"
																	onChange={() => handleSelect(product)}
																	type="checkbox"
																	checked={selectedProducts.some(
																		(selectedProduct) => selectedProduct.uniqueKey == product.uniqueKey
																	)}
																/>
																{product.name[language]}
															</div>
															<p
																onClick={() => {
																	const sameProduct = toBuyProducts.some(
																		(p) => p.uniqueKey === product.uniqueKey
																	);

																	if (sameProduct) {
																		handleUnselectProduct(product.uniqueKey, listId);
																	} else {
																		return;
																	}
																}}
															>
																<FontAwesomeIcon icon={faXmark} />
															</p>
														</ProductCell>
													</ProductRow>
												);
											}
											return null;
										})}
									</React.Fragment>
								)
							)}
					</ProductTable>
				)}

				{selected === 'My Products' && (
					<ProductTable>
						{language == 'mt' && (
							<div className="custom-grp">
								<input
									onChange={handleAddMalteseCustomValidity}
									className="addProduct"
									ref={malteseNameRef}
									placeholder="Zied prodott gdid"
								/>
								<button
									className={!customItemNameValid && 'lightest'}
									onClick={() => {
										handleAddMalteseProduct('mt');
									}}
									disabled={!customItemNameValid}
								>
									Zied il prodott
								</button>
							</div>
						)}

						{language == 'en' && (
							<div className="custom-grp">
								<input
									onChange={handleAddEnglishCustomValidity}
									className="addProduct"
									ref={englishNameRef}
									placeholder="Add a new product"
								/>
								<button
									className={!customItemNameValid && 'lightest'}
									onClick={() => {
										handleAddEnglishProduct('en');
									}}
									disabled={!customItemNameValid}
								>
									Add the product
								</button>
							</div>
						)}

						{/* Continue over here */}
						{customProducts.length == 0 && <div className="center-div">No custom Products</div>}
						{customProducts.length > 0 &&
							customProducts
								.filter((product) => {
									const translatedName = product.name[language] || product.name.en;
									return translatedName.toLowerCase().includes(searchTerm.toLowerCase());
								})
								.map((product) => (
									<ProductRow className="myProductsRows" key={product.uniqueKey}>
										<div
											onClick={() => {
												handleEditCustomItem(product);
											}}
											className="top"
										></div>
										<ProductCell>
											{customListLoading && <GetListLoader />}
											<div className="grp-check custom-item boldest">
												<input
													className="radio"
													onChange={() => handleSelect(product)}
													type="checkbox"
													checked={selectedProducts.some(
														(selectedProduct) => selectedProduct.uniqueKey == product.uniqueKey
													)}
												/>
												<p
													onClick={() => {
														handleEditCustomItem(product);
													}}
													className="name large"
												>
													{product.name[language] || product.name.en}
												</p>
											</div>
											<p
												onClick={() => {
													handleEditCustomItem(product);
												}}
												className="category lighter"
											>
												{product.category == null ? '' : product.category.en}
											</p>
											<div className="grp narrow">
												<p
													className="trash"
													onClick={() => {
														handleDeleteCustomItem(product, userId);
													}}
												>
													<FontAwesomeIcon icon={faTrashCan} />
												</p>
												<p
													className="remove"
													onClick={() => {
														const sameProduct = toBuyProducts.some((p) => p.uniqueKey === product.uniqueKey);

														if (sameProduct) {
															handleUnselectProduct(product.uniqueKey, listId);
														} else {
															return;
														}
													}}
												>
													<FontAwesomeIcon icon={faXmark} />
												</p>
											</div>
										</ProductCell>
										<div
											onClick={() => {
												handleEditCustomItem(product);
											}}
											className="bottom"
										></div>
									</ProductRow>
								))}
					</ProductTable>
				)}
			</Main>
			{customProductToDelete && (
				<DeleteCustomProduct
					setCustomProductToDelete={setCustomProductToDelete}
					customProductToDelete={customProductToDelete}
					getMyProducts={getMyProducts}
				/>
			)}
		</Container>
	);
};

export default ProductOverlay;
