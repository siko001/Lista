import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
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

const DeleteOverlay = ({ closeOverlay, setMessage, deleteID, setDeleteLoader, setStatus, updateList, deleteTitle }) => {
	const { translate } = useLanguage();

	//Continue the dlete logic
	const handleDeleteConfirmation = () => {
		setDeleteLoader(true);
		closeOverlay((prev) => !prev);
		console.log(deleteID);
		axiosClient
			.delete(`list/delete/${deleteID}`, deleteID)
			.then(() => {
				setMessage(deleteTitle + ' ' + translate('notification-delete-success'));

				// Update the local storage data after deleting from the database
				let allLists = localStorage.getItem('shoppingLists');

				// Assuming allLists is a string representation of JSON data, parse it into an array
				allLists = JSON.parse(allLists) || [];

				// Remove the deleted list from the local storage data
				const updatedLists = allLists.filter((list) => list.id !== deleteID);

				// Save the updated data back to local storage
				localStorage.setItem('shoppingLists', JSON.stringify(updatedLists));
				updateList();
			})
			.catch(() => {
				setStatus(400);
				setMessage(translate('notification-delete-fail'));
			})
			.finally(() => {
				setDeleteLoader(false);
				return setTimeout(() => {
					setStatus(null);
					setMessage(null);
				}, 1600);
			});
	};

	const close = () => {
		closeOverlay((prev) => !prev);
	};
	return (
		<Background>
			<Container>
				<InnerContainer>
					<h3 className="heading">
						{translate('deleteOverlay')} <br></br> {deleteTitle}
					</h3>
					<hr></hr>
					<div className="group">
						<button className="btn" onClick={close}>
							{translate('cancel-btn')}
						</button>
						<button className="btn btn-main red-bg" onClick={handleDeleteConfirmation}>
							{translate('delete-btn')}
						</button>
					</div>
				</InnerContainer>
			</Container>
		</Background>
	);
};

export default DeleteOverlay;
