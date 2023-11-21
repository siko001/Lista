import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import axiosClient from '../axiosClient';
import ReadyProduct from './ReadyProduct';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

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
		display: flex;
		flex: 0.5;
		gap: 10px;
		justify-content: space-evenly;
		margin: 0 20px;
		@media screen and (max-width: 650px) {
			min-width: 120px;
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
	handleRemoveFromToBuy,
}) => {
	const { translate } = useLanguage();

	const handleRemoveProduct = (product, id) => {
		setProductToRemove(product);
		setProductIDRemove(id);
		setRemoveProduct((prev) => !prev);
	};
	const totalProductPrice = quantity * price;

	const handleMoveToReady = (id, prod) => {
		const product = prod.filter((prod) => prod.uniqueKey == id);
		setTimeout(() => {
			setReadyProducts((preProduct) => [...preProduct, product[0]]);
			handleRemoveFromToBuy(id);
		}, 1000);

		axiosClient
			.put(`/update/product${id}/${listId}`, [id, listId])
			.then((res) => {
				// console.log(res);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {});

		// const allProducts = JSON.parse(localStorage.getItem(`allProductsInList${listId}`));
		// const allProductsInToBuy = JSON.parse(localStorage.getItem(`toBuyProductsInList${listId}`));

		// // Find the index of the selected product in the allProducts array
		// const productIndex = allProducts.filter((p) => p.uniqueKey === id);
		// const productIndexInToBuy = allProductsInToBuy.findIndex((p) => p.uniqueKey === id);

		// console.log(allProducts);
		// console.log(productIndexInToBuy);
		// setTimeout(() => {

		// 	// Check if the selected product is in the toBuy list and remove it
		// 	if (productIndexInToBuy !== -1) {
		// 		allProductsInToBuy.splice(productIndexInToBuy, 1);
		// 		localStorage.setItem('toBuyProductsInList' + currentList.id, JSON.stringify(allProductsInToBuy));
		// 	}

		// 	// Update the status of the selected product to "ready"
		// 	if (productIndex !== -1) {
		// 		allProducts[productIndex].status = 'ready';

		// 		// Save the modified allProducts array back to localStorage
		// 		localStorage.setItem('allProductsInList' + currentList.id, JSON.stringify(allProducts));

		// 		// Save the updated readyProducts array to localStorage
		// 		localStorage.setItem('readyProductsInList' + currentList.id, JSON.stringify(allProducts.filter((p) => p.status === 'ready')));
		// 	}
	};

	return (
		<Container key={productName}>
			<div className="left">
				<input
					onChange={() => {
						handleMoveToReady(productKey, item);
					}}
					className="radio"
					type="checkbox"
				/>
				<div className="product_title bolder">{productName}</div>
			</div>

			<div className="center">
				{quantity + unit && (
					<div className="group">
						<div className="description">{translate('quantity')}</div>
						<div className="quantative">
							{quantity}
							<span>{unit}</span>
						</div>
					</div>
				)}
				{price && (
					<div className="group">
						<div className="description">{translate('price')}</div>
						<div className="quantative">
							{price}
							<span>€</span>
						</div>
					</div>
				)}
				{totalProductPrice && (
					<div className="group">
						<div className="description">{translate('total')}</div>
						<div className="quantative">
							{totalProductPrice}
							<span>€</span>
						</div>
					</div>
				)}
			</div>
			<div onClick={() => handleRemoveProduct(productName, productKey)} className="removeProduct light largest">
				<FontAwesomeIcon icon={faXmark} />
			</div>
		</Container>
	);
};

export default Product;
