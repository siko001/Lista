import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	justify-content: space-between;
	align-items: center;
	display: flex;
	width: 100%;
	height: 50px;
	@media screen and (max-width: 950px) {
		width: 90%;
	}
	&:hover {
		background-color: rgba(0, 0, 0, 0.3);
	}
	.left {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-left: 10px;
		gap: 10px;

		.product_title {
			font-size: 1.3rem;
			width: 200px;
			max-width: 200px;
			overflow: hidden;

			@media screen and (max-width: 750px) {
				font-size: 0.9rem;
				width: 140px;
				max-width: 140px;
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

const Product = ({ setRemoveProduct, product, setProductToRemove, productName, quantity, unit, price }) => {
	const handleRemoveProduct = (product) => {
		setProductToRemove(product);
		setRemoveProduct((prev) => !prev);
	};
	const totalProductprice = quantity ? quantity : null * price ? price : null;
	return (
		<Container>
			<div className="left">
				<input className="radio" type="checkbox" />
				<div className="product_title">{productName}</div>
			</div>

			<div className="center">
				{quantity && unit && (
					<div className="group">
						<div className="description">Quantity</div>
						<div className="quantative">
							{quantity}
							{unit}
						</div>
					</div>
				)}
				{price && (
					<div className="group">
						<div className="description">Price</div>
						<div className="quantative">
							{price}
							<span>€</span>
						</div>
					</div>
				)}
				{totalProductprice && (
					<div className="group">
						<div className="description">Total</div>
						<div className="quantative">
							{totalProductprice}
							<span>€</span>
						</div>
					</div>
				)}
			</div>
			<div onClick={() => handleRemoveProduct(productName)} className="removeProduct light">
				X
			</div>
		</Container>
	);
};

export default Product;
