import React, { useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../axiosClient';
import RemoveProductLoader from '../loaders/RemoveProductLoader';

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
	max-width: 380px;
	padding: 0 10px;
	background-color: #fff;
	border-radius: 8px;
	align-items: center;
	justify-content: center;
	@media screen and (max-width: 960px) {
		top: 20px;
		width: 90%;
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
			font-size: 0.844rem;
			font-weight: 500;
			letter-spacing: 0.8px;
		}
	}
	h3 {
		font-size: 1.5rem;
		color: #333;
	}
`;

const DeleteCustomProduct = ({ customProductToDelete, setCustomProductToDelete, getMyProducts, setMessage }) => {
	const { translate, language } = useLanguage();
	const [productBeingRemove, setSroductBeingRemove] = useState(false);
	const close = () => {
		setCustomProductToDelete((prev) => !prev);
	};

	const handleDeleteItem = (customProductToDelete) => {
		const { user_id, uniqueKey } = customProductToDelete;
		if (!customProductToDelete.uniqueKey) {
	
			const customProducts = JSON.parse(localStorage.getItem('customItemsUser' + user_id));
			const indexToDelete = customProducts.findIndex(
				(p) => p.name.en === customProductToDelete.name.en || p.name.mt === customProductToDelete.name.mt
			);
			if (indexToDelete !== -1) {
				customProducts.splice(indexToDelete, 1);

				localStorage.setItem('customItemsUser' + user_id, JSON.stringify(customProducts));
			}
		}
		setSroductBeingRemove(true);
		axiosClient
			.delete(`/delete-myProduct/${uniqueKey}/${user_id}`)
			.then((res) => {
							setMessage('ProductDeleted');
			})
			.catch((err) => {
			
			})
			.finally(() => {
				getMyProducts();
				setCustomProductToDelete((prev) => !prev);
				return setTimeout(() => {
					setMessage(null);
				}, 1600);
			});
	};

	return (
		<Background>
			<Container>
				<InnerContainer>
					<h3 className="heading">
						{translate('delete-custom-item')} <br></br>
						{customProductToDelete.name.en || customProductToDelete.name.mt || ''}
					</h3>
					<hr></hr>
					<div className="group">
						<button className="btn" onClick={close}>
							{translate('cancel-btn')}
						</button>
						<button
							onClick={() => {
								handleDeleteItem(customProductToDelete);
							}}
							className="btn btn-main red-bg"
						>
							{translate('delete-btn')}
						</button>
					</div>
				</InnerContainer>
			</Container>
			{productBeingRemove && <RemoveProductLoader />}
		</Background>
	);
};

export default DeleteCustomProduct;
