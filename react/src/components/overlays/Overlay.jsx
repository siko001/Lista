import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosClient from '../../axiosClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePen } from '@fortawesome/free-solid-svg-icons';

const Background = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	z-index: 1;
	top: 0px;
	background-color: rgba(178, 178, 178, 0.7);
	width: 100%;
	height: 100%;

	@media screen and (max-width: 960px) {
		display: block;
	}
`;

const Container = styled.div`
	margin: 20px auto;
	width: 300px;
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
	form {
		padding: 30px 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}

	.inputOverlay {
		border: 1px solid rgba(10, 107, 222, 0.4);
		height: 40px;
		width: 100%;
		border-radius: 6px;
		background-color: rgba(0, 0, 0, 0.08);
		padding: 0 10px;
		width: 80%;
		max-height: 60px;
		min-height: 40px;
		display: flex;
		align-items: center;
		color: rgba(0, 0, 0, 0.7);
	}

	.inputLength {
		display: grid;
		place-items: center;
		min-width: 25px;
		max-width: 40px;
		font-size: 15px;
		margin-left: 5px;
	}
	input {
		background-color: transparent;
		height: 100%;
		width: 70%;
		outline: none;
	}
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

	.fifth-step {
		position: absolute;
		z-index: 0;
	}
`;

const Overlay = ({ closeOverlay, setMessage, setStatus, setLoading, addNewList, fetchLists, setNewList, setNewListB }) => {
	const listRef = useRef();
	const { translate } = useLanguage();
	const [notIsValid, setNotIsValid] = useState(null);
	const [isEmpty, setIsEmpty] = useState(true);
	const maxNameLength = 20;
	const [nameLength, setNameLength] = useState('');

	const close = () => {
		closeOverlay();
	};
	const validateInput = () => {
		const inputText = listRef.current.value;
		const trimmedInput = inputText.trim();

		setNameLength(trimmedInput.length);

		setIsEmpty(trimmedInput === '');

		if (!(trimmedInput.length >= 3 && trimmedInput.length <= 20)) {
			setNotIsValid(true);
		} else {
			setNotIsValid(false);
		}
	};

	const handleCreateList = (e) => {
		e.preventDefault();
		setLoading(true);

		const payload = {
			listName: listRef.current.value,
			ID: localStorage.getItem('ACCESS_TOKEN'),
		};

		axiosClient
			.post('/create-list', payload)
			.then((response) => {
				setMessage(translate('response-200-created'));
				addNewList(response.data);
				setNewList(true);
				setNewListB(true);
				// Save the created list to local storage
				const allLists = JSON.parse(localStorage.getItem('shoppingLists')) || [];
				allLists.push(response.data);
				localStorage.setItem('shoppingLists', JSON.stringify(allLists));
			})
			.catch((err) => {
				if (err.response.status == 422) {
					setMessage(translate('response-422'));
					setStatus(400);
				} else {
					setStatus(400);
					setMessage(translate('response-400-error'));
				}
			})
			.finally(() => {
				setLoading(false);
				closeOverlay(true);
				fetchLists();
				setTimeout(() => {
					setNewList(false);
				}, 100);
				setTimeout(() => {
					setNewListB(false);
				}, 8000);

				return setTimeout(() => {
					setStatus(200);
					setMessage(null);
				}, 1600);
			});
	};

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, []);

	//Function to accept Enter key to create a new List
	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			{
				handleCreateList(e);
			}
		} else {
			return;
		}
	};

	return (
		<Background>
			<Container className="create-step">
				<InnerContainer>
					<form>
						<h3 style={{ color: notIsValid == true ? ' red' : '' }} className="heading">
							{translate('createListHeading')}
						</h3>
						<div style={{ border: notIsValid ? '1px solid red' : '' }} className="inputOverlay ">
							<input
								placeholder={translate('createListPlaceholder')}
								type="text"
								onChange={validateInput}
								onKeyDown={handleKeyDown}
								ref={listRef}
								maxLength={20}
							/>
							<FontAwesomeIcon style={{ height: '80%' }} icon={faSquarePen} />
							<p className="inputLength">{nameLength + '/' + maxNameLength}</p>
						</div>
						<div className="group">
							<button className="btn" onClick={close}>
								{translate('cancel-btn')}
							</button>
							<button
								className={notIsValid ? 'btn btn-main lightest' : 'btn btn-main'}
								disabled={notIsValid}
								onClick={handleCreateList}
							>
								{translate('create-btn')}
							</button>
						</div>
					</form>
				</InnerContainer>
			</Container>
		</Background>
	);
};

export default Overlay;
