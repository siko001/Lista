import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';

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

//Make A Deleting List and Products Loader
const DeleteListAndProductOverlay = ({ title, setOpenEmptyAndDeleteListOverlay, setEmptyList, listId, setEmptyAndDeleteList }) => {
	const id = listId;
	const navigate = useNavigate();
	const { translate } = useLanguage();
	const handleDeleteConfirmation = () => {
		setEmptyAndDeleteList(true);
		setOpenEmptyAndDeleteListOverlay((prev) => !prev);
		// Update the local storage to empty
		localStorage.removeItem(`allProductsInList${listId}`);
		localStorage.removeItem(`readyProductsInList${listId}`);
		localStorage.removeItem(`toBuyProductsInList${listId}`);

		axiosClient
			.delete(`/delete/all-products/and-list${id}`, id)
			.then((res) => {
				const homeUrl = '/';
				navigate(homeUrl);
			})
			.then((err) => {
				console.log(err.message);
			})
			.finally(() => {
				setEmptyAndDeleteList(false);
			});
	};

	const close = () => {
		setOpenEmptyAndDeleteListOverlay((prev) => !prev);
	};
	return (
		<Background>
			<Container>
				<InnerContainer>
					<h3 className="heading">
						{translate('empty-and-delete-text')} <br></br>
						{title} <br></br>
						{translate('empty-and-delete-text-pt2')}
					</h3>
					<hr></hr>
					<div className="group">
						<button className="btn" onClick={close}>
							{translate('cancel-btn')}
						</button>
						<button className="btn btn-main red-bg" onClick={handleDeleteConfirmation}>
							{translate('delete-list-and-products-btn')}
						</button>
					</div>
				</InnerContainer>
			</Container>
		</Background>
	);
};

export default DeleteListAndProductOverlay;
