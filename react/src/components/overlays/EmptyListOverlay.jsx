import React from 'react';
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

const EmptyListOverlay = ({ title, setOpenEmptyListOverLay, setEmptyList, listId, updateList }) => {
	const storedLanguage = localStorage.getItem('selectedLanguage');
	const { translate } = useLanguage();
	const handleDeleteConfirmation = () => {
		setEmptyList(true);
		setOpenEmptyListOverLay((prev) => !prev);

		const allLists = JSON.parse(localStorage.getItem('shoppingLists'));

		const correctList = allLists.find((list) => list.id == listId);
		// Update the count
		correctList.totalProductCount = 0;
		correctList.totalReadyProducts = 0;
		localStorage.setItem('shoppingLists', JSON.stringify(allLists));

		// Update the local storage to empty
		localStorage.setItem(`allProductsInList${listId}`, JSON.stringify(''));
		localStorage.setItem(`readyProductsInList${listId}`, JSON.stringify(''));
		localStorage.setItem(`toBuyProductsInList${listId}`, JSON.stringify(''));

		//Empty the Db
		axiosClient
			.delete(`empty-list/${listId}`, listId)
			.then((res) => {
				console.log(res);
				updateList();
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setEmptyList((prev) => !prev);
			});
	};

	const close = () => {
		setOpenEmptyListOverLay((prev) => !prev);
	};
	return (
		<Background>
			<Container>
				<InnerContainer>
					<h3 className="heading">
						{translate('empty-list-overlay')} <br></br> {title} <br></br>
						{storedLanguage == 'en' && translate('empty-listP2-overlay')}
					</h3>
					<hr></hr>
					<div className="group">
						<button className="btn" onClick={close}>
							{translate('cancel-btn')}
						</button>
						<button className="btn btn-main red-bg" onClick={handleDeleteConfirmation}>
							{translate('empty-list-btn')}
						</button>
					</div>
				</InnerContainer>
			</Container>
		</Background>
	);
};

export default EmptyListOverlay;
