import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosClient from '../../axiosClient';

const Background = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	z-index: 1;
	top: 0px;
	background-color: rgba(0, 0, 0, 0.7);
	width: 100%;
	height: 100%;

	@media screen and (max-width: 960px) {
		display: block;
	}
`;

const Container = styled.div`
	border: 1px solid white;
	margin: 20px auto;
	min-width: 300px;
	max-width: 400px;
	background-color: #fff;
	border-radius: 8px;
	align-items: center;
	justify-content: center;
	@media screen and (max-width: 960px) {
		top: 20px;
		width: 90%;
		min-width: 90%;
		max-width: 95%;
	}
`;

const InnerContainer = styled.div`
	padding: 30px 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	text-align: center;

	.group {
		display: flex;
		justify-content: space-between;
		width: 80%;

		button {
			width: 48%;
			font-size: 0.9rem;
			font-weight: 500;
			letter-spacing: 0.8px;
		}
	}
	h3 {
		font-size: 1.5rem;
		color: #333;
	}
`;
const RemoveProductOverlay = ({
	productToRemove,
	listTitle,
	setRemoveProduct,
	setProduct,
	listId,
	productIDRemove,
	setMessage,
	setStatus,
	setRemoveProductConfirmation,
	updateList,
}) => {
	const { language, translate, translateProductNames } = useLanguage();

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, []);

	const close = () => {
		setRemoveProduct((prev) => !prev);
	};

	const handleRemoveProduct = () => {
		setRemoveProductConfirmation(true);
		const localNOTReadyList = JSON.parse(localStorage.getItem(`toBuyProductsInList${listId}`)) || [];
		const localReadyList = JSON.parse(localStorage.getItem(`readyProductsInList${listId}`)) || [];
		const localList = JSON.parse(localStorage.getItem(`allProductsInList${listId}`)) || [];
		// Filter out the product to be removed
		const updatedReadyList = localReadyList.filter((p) => p.uniqueKey !== productIDRemove);
		const updatedNOTReadyList = localNOTReadyList.filter((p) => p.uniqueKey !== productIDRemove);
		const updatedList = localList.filter((p) => p.uniqueKey !== productIDRemove);

		// Update the local storage
		localStorage.setItem(`toBuyProductsInList${listId}`, JSON.stringify(updatedNOTReadyList));
		localStorage.setItem(`allProductsInList${listId}`, JSON.stringify(updatedList));
		localStorage.setItem(`readyProductsInList${listId}`, JSON.stringify(updatedReadyList));
		setRemoveProduct((prev) => !prev);

		axiosClient
			.delete(`remove-product/${productIDRemove}/${listId}`)
			.then((res) => {
		
				setMessage(translate('removed-product'));
			})
			.catch((err) => {
				setMessage(translate('removed-product-fail'));
				setStatus(400);
			})
			.finally(() => {
				setProduct(updatedList);
				setRemoveProductConfirmation(false);
				setTimeout(() => {
					return setTimeout(() => {
						setStatus(200);
						setMessage(null);
						updateList();
					}, 1600);
				});
			});
	};

	return (
		<Background>
			<Container>
				<InnerContainer>
					<h3 className="heading">
						{translate('deleteProductOverlay')} {productToRemove} <br></br>
						{translate('deleteProductOverlayPt2')} {listTitle}
					</h3>
					<hr></hr>
					<div className="group">
						<button className="btn" onClick={close}>
							{translate('cancel-btn')}
						</button>
						<button
							onClick={() => {
								handleRemoveProduct();
							}}
							className="btn btn-main red-bg"
						>
							{translate('remove-btn')}
						</button>
					</div>
				</InnerContainer>
			</Container>
		</Background>
	);
};

export default RemoveProductOverlay;
