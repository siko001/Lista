import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PopularProducts from '../popularProducts';
import axiosClient from '../axiosClient';
import { useParams } from 'react-router-dom';

const Container = styled.div`
	z-index: 999;
	color: #fff;
	position: absolute;
	top: 0;
	min-height: 100vh;
	width: 100%;
	max-width: 100vw;
	position: fixed;

	.grp {
		display: flex;
		align-items: center;
		width: 100px;
		padding-bottom: 6px;
	}

	nav {
		width: 100%;
		display: flex;
		gap: 20px;
		font-weight: 600;
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
		width: 80%;
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
		width: 80%;
	}
`;

const ProductTable = styled.div`
	width: 95%;
	margin: 10px auto;
	border-radius: 5px;
	overflow: auto;

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
`;

const ProductCell = styled.div`
	display: flex;
	justify-content: space-between;
	width: 95%;
	padding: 10px;
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
	setToBuyProducts,
	readyProducts,
	setReadyProducts,
}) => {
	const [selected, setSelected] = useState('Popular Products');
	const [selectedFilter, setSelectedFilter] = useState('random');

	const listId = id;

	useEffect(() => {
		// Load the list of selected products from local storage

		// console.log(toBuyProducts);
		console.log(selectedProducts);
		// const storedProducts = JSON.parse(localStorage.getItem(`allProductsInList` + id)) || [];
		setSelectedProducts(selectedProducts);

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
		if (selectedProducts.some((selectedProduct) => selectedProduct.uniqueKey === productId)) {
			return;
		}

		// Update the list of selected products
		const updatedSelectedProducts = [...selectedProducts, product];
		setSelectedProducts(updatedSelectedProducts);

		// // Update local storage
		// const allLists = JSON.parse(localStorage.getItem(`shoppingLists`)) || [];

		// const updatedLists = allLists.map((list) => {
		// 	if (list.id == listId) {
		// 		// Find the list by ID and add the product to its products array
		// 		const allProducts = JSON.parse(localStorage.getItem(`allProductsInList` + listId)) || [];

		// 		const toBuyProducts = JSON.parse(localStorage.getItem(`toBuyProductsInList` + listId)) || [];

		// 		const updatedProducts = [...allProducts, product];
		// 		const updatedToBuyProducts = [...toBuyProducts, product]; // Add the new product to the existing products

		// 		localStorage.setItem(`allProductsInList` + listId, JSON.stringify(updatedProducts));
		// 		localStorage.setItem(`toBuyProductsInList` + listId, JSON.stringify(updatedToBuyProducts));
		// 	}
		// 	return list;
		// });

		// // Save the updated data back to local storage
		// localStorage.setItem(`shoppingLists`, JSON.stringify(updatedLists));

		axiosClient
			.post(`/add-product/${product.name}`, [listId, product])
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

	const handleUnselectProduct = (productId, listId) => {
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

	const RecentProducts = [
		{
			name: '',
			category: '',
			price: '',
			unit: '',
			Quantity: '',
		},
	];

	return (
		<Container style={{ backgroundColor: darkMode ? 'rgb(0,0,0)' : 'rgb(255,255,255)' }}>
			<SearchInput
				placeholder="Eg. Broccoli"
				style={{
					backgroundColor: darkMode ? 'rgba(43, 43, 43, 1)' : '#bcbcbc',
					color: darkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)',
					border: darkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)',
				}}
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
								Random
							</ProductFilterButton>
							<ProductFilterButton value="category" active={selectedFilter.toString(selectedFilter === 'random')}>
								By Category
							</ProductFilterButton>
							{/* Add more filter buttons for future filters */}
						</ProductFilter>
					</div>
					<div
						className={`nav-item ${selected === 'Popular Products' ? 'selected' : ''}`}
						onClick={() => handleNavItemClick('Popular Products')}
					>
						Popular Products
					</div>
					<div
						className={`nav-item ${selected === 'My Products' ? 'selected' : ''}`}
						onClick={() => handleNavItemClick('My Products')}
					>
						My Products
					</div>
				</nav>
				<ProductTable>
					{selectedFilter === 'random' &&
						PopularProducts.map((product, index) => (
							<ProductRow key={index}>
								<ProductCell key={index}>
									<div className="grp-check">
										<input
											className="radio"
											onChange={() => handleSelect(product)}
											type="checkbox"
											checked={selectedProducts.some(
												(selectedProduct) => selectedProduct.uniqueKey == product.uniqueKey
											)}
										/>
										{product.name}
									</div>
									<p
										onClick={() => {
											handleUnselectProduct(product.uniqueKey, listId);
										}}
									>
										X
									</p>
								</ProductCell>
							</ProductRow>
						))}

					{selectedFilter === 'category' &&
						Array.from(new Set([...PopularProducts, ...RecentProducts].map((product) => product.category))).map(
							(category, index) => (
								<React.Fragment key={index}>
									<ProductRow>
										<ProductCell style={{ fontWeight: 'bold', color: '#00a26f', backgroundColor: '#00000033' }}>
											{category}
										</ProductCell>
									</ProductRow>
									{PopularProducts.concat(RecentProducts).map((product, productIndex) => {
										if (product.category === category) {
											return (
												<ProductRow key={productIndex}>
													<ProductCell>
														<div className="grp-check">
															<input
																className="radio"
																onChange={() => handleSelect(product)}
																type="checkbox"
																checked={selectedProducts.some(
																	(selectedProduct) => selectedProduct.uniqueKey === product.uniqueKey
																)}
															/>
															{product.name}
														</div>
														<p
															onClick={() => {
																handleUnselectProduct(product.uniqueKey, listId);
															}}
														>
															X
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
			</Main>
		</Container>
	);
};

export default ProductOverlay;
