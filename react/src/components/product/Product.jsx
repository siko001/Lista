import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosClient from '../../axiosClient';
import ReadyProduct from './ReadyProduct';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Echo from 'laravel-echo';

const Container = styled.div`
	justify-content: space-between;
	align-items: center;
	display: flex;
	width: 100%;
	min-height: 50px;
	padding: 10px 20px;
	@media screen and (max-width: 950px) {
		width: 90%;
	}
	@media screen and (max-width: 650px) {
		width: 95%;
	}
	&:hover {
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50px;
	}
	.left {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-left: 10px;
		gap: 10px;
		@media screen and (max-width: 750px) {
			margin-left: 0px;
		}

		.product_title {
			font-size: 1.3rem;
			width: 200px;
			max-width: 200px;
			overflow: hidden;

			@media screen and (max-width: 750px) {
				font-size: 0.9rem;
				max-width: 130px;
			}
		}
	}

	.radio:hover {
		cursor: pointer;
	}

	.radio[type='checkbox'] {
		border-radius: 10%;
		height: 20px;
		width: 20px;

		background-color: green;
	}
	.radio[type='checkbox']:checked {
		color: green;
		border-radius: 50%;
	}
	.center {
		border-radius: 15px;
		min-height: 33px;
		display: flex;
		flex: 1;
		justify-content: center;
		gap: 10px;
		margin: 0 20px;
		&:hover {
			border: 1px solid;
			cursor: pointer;
		}
		.empty {
			border-radius: 15px;
			min-height: 33px;
			display: flex;
			flex: 1;
			justify-content: center;
			gap: 10px;
			margin: 0 20px;
		}
		@media screen and (max-width: 650px) {
			min-width: 120px;
			gap: 5px;
			margin: 0 10px;
		}
		.group {
			text-align: center;
		}

		.description {
			opacity: 0.7;
			font-size: 0.7rem;
		}

		.quantative {
			font-size: 1.2rem;
			@media screen and (max-width: 750px) {
				font-size: 1rem;
			}
		}
		span {
			font-size: 0.9rem;
		}
	}

	.removeProduct {
		margin-right: 10px;
		width: 25px;
		height: 25px;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			border: 3px solid;
			border-radius: 50%;
			border-color: ${(props) => (props.darkMode ? 'rgba(255, 0, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)')};
			cursor: pointer;
			color: rgba(255, 0, 0, 0.7);
		}
	}
`;

const Product = ({
	setRemoveProduct,
	setProductToRemove,
	setProductIDRemove,
	productName,
	quantity,
	unit,
	price,
	productKey,
	setReadyProducts,
	setProduct,
	item,
	listId,
	setToBuyProducts,
	setOpenEditProduct,
	setProductToEdit,
	wholeProduct,
	fetchListData,
}) => {
	const { translate } = useLanguage();
	const { darkMode, setDarkMode } = useDarkMode();


	const handleRemoveProduct = (product, id) => {
		setProductToRemove(product);
		setProductIDRemove(id);
		setRemoveProduct((prev) => !prev);
	};
	const totalProductPrice = quantity * price;

	const handleMoveToReady = (id, prod) => {
		const product = prod.filter((prod) => prod.uniqueKey === id);

		const allProducts = JSON.parse(localStorage.getItem(`allProductsInList${listId}`));

		const allLists = JSON.parse(localStorage.getItem('shoppingLists'));

		const correctList = allLists.find((list) => list.id == listId);
		// Update the count
		correctList.totalReadyProducts++;
		localStorage.setItem('shoppingLists', JSON.stringify(allLists));

		const allProductsInToBuy = JSON.parse(localStorage.getItem(`toBuyProductsInList${listId}`));
		const allProductsInReady = JSON.parse(localStorage.getItem(`readyProductsInList${listId}`));
		const userId = localStorage.getItem('ACCESS_TOKEN');

		// FIND AND REMOVE THE ITEM FROM THE TO-BUY LOCALSTORAGE AND MOVE TO READY
		// Find the index of the selected product in the toBuyProductsInList array
		const productIndexInToBuy = allProductsInToBuy.findIndex((p) => p.uniqueKey === id);
		// If the product is found in toBuyProductsInList, remove it
		if (productIndexInToBuy !== -1) {
			// Get the removed product and update its status to 'ready'
			const removedProduct = { ...allProductsInToBuy[productIndexInToBuy], status: 'ready' };
			// Create a new array excluding the selected product in toBuyProductsInList
			const updatedToBuyProducts = allProductsInToBuy.filter((_, index) => index !== productIndexInToBuy);
			// Update the local storage with the new array in toBuyProductsInList
			localStorage.setItem(`toBuyProductsInList${listId}`, JSON.stringify(updatedToBuyProducts));
			// Add the removed product to the readyProductsInList
			const updatedReadyProducts = [...allProductsInReady, removedProduct];
			// Update the local storage with the new array in readyProductsInList
			localStorage.setItem(`readyProductsInList${listId}`, JSON.stringify(updatedReadyProducts));
			setReadyProducts(updatedReadyProducts);
			setToBuyProducts(updatedToBuyProducts);
		}

		// CHANGE THE PRODUCT STATUS IN LOCAL STROAGE LIST
		// Find the index of the selected product in the allProducts array
		const productIndexInAll = allProducts.findIndex((p) => p.uniqueKey === id);
		// If the product is found in allProducts, update its status to 'ready'
		if (productIndexInAll !== -1) {
			allProducts[productIndexInAll].status = 'ready';
			// Optionally, you can create a copy of the updated allProducts array
			const updatedAllProducts = [...allProducts];
			// Update the local storage with the new array
			localStorage.setItem(`allProductsInList${listId}`, JSON.stringify(updatedAllProducts));
			setProduct(updatedAllProducts);
		}

		axiosClient
			.put(`/update/product${id}/${listId}/${userId}`, [id, listId])
			.then((res) => {
			})
			.catch((err) => {
			})
			.finally(() => {});
	};
	const handleProductSelect = (wholeProduct) => {
		setOpenEditProduct((prev) => !prev);

		setProductToEdit(wholeProduct);
	};

	return (
		<Container key={productName}>
			<div className="left">
				<input
					onChange={() => {
						handleMoveToReady(productKey, item);
					}}
					className="radio mark-ready"
					type="checkbox"
				/>
				<div className="product_title bolder">{productName}</div>
			</div>

			<div
				onClick={() => {
					handleProductSelect(wholeProduct);
				}}
				className="center product-edit"
				style={{ borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)' }}
			>
				{quantity && quantity != 0 && (
					<div className="group">
						<div className="description">{translate('quantity')}</div>
						<div className="quantative">
							{quantity}
							<span>{unit}</span>
						</div>
					</div>
				)}
				{price && price != 0 && (
					<div className="group">
						<div className="description">{translate('price')}</div>
						<div className="quantative">
							{price}
							<span>€</span>
						</div>
					</div>
				)}
				{totalProductPrice ? (
					<div className="group">
						<div className="description">{translate('total')}</div>
						<div className="quantative">
							{totalProductPrice}
							<span>€</span>
						</div>
					</div>
				) : (
					''
				)}
			</div>
			<div onClick={() => handleRemoveProduct(productName, productKey)} className="removeProduct light largest remove-product-to-buy">
				<FontAwesomeIcon icon={faXmark} />
			</div>
		</Container>
	);
};

export default Product;
