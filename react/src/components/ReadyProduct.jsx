import React from 'react';

import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

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
			border: 1px solid;
			border-radius: 50%;
			border-color: ${(props) => (props.darkMode ? 'rgba(255, 0, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)')};
			cursor: pointer;
			color: rgba(255, 0, 0, 0.7);
		}
	}
`;

const ReadyProduct = ({ item }) => {
	const theReadyProduct = item;
	const totalProductPrice = theReadyProduct.quantity * theReadyProduct.price;
	const { translate } = useLanguage();

	return (
		<Container key={theReadyProduct.name}>
			<div className="left">
				<div className="product_title">{theReadyProduct.name}</div>
			</div>

			<div className="center">
				{theReadyProduct.quantity + theReadyProduct.unit && (
					<div className="group">
						<div className="description">{translate('quantity')}</div>
						<div className="quantative">
							{theReadyProduct.quantity}
							{theReadyProduct.unit}
						</div>
					</div>
				)}
				{theReadyProduct.price && (
					<div className="group">
						<div className="description">{translate('price')}</div>
						<div className="quantative">
							{theReadyProduct.price}
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
			<div onClick={() => handleRemoveProduct(productName, productKey)} className="removeProduct light">
				X
			</div>
		</Container>
	);
};

export default ReadyProduct;
