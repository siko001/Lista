import React, { useRef, useEffect, useState } from 'react';
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
	input {
		border: 1px solid rgba(10, 107, 222, 0.4);
		height: 40px;
		width: 80%;
		border-radius: 6px;
		background-color: rgba(0, 0, 0, 0.08);
		outline: none;
		padding: 0 10px;
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
`;

const Overlay = ({ closeOverlay, setMessage, setStatus, setLoading, addNewList, fetchLists }) => {
	const listRef = useRef();
	const { translate } = useLanguage();
	const [notIsValid, setNotIsValid] = useState(true);
	const [isEmpty, setIsEmpty] = useState(true);

	const close = () => {
		closeOverlay();
	};

	const validateInput = () => {
		const inputText = listRef.current.value;
		const trimmedInput = inputText.trim();

		setIsEmpty(trimmedInput === '');
		if (trimmedInput.length < 3) {
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
		};

		axiosClient
			.post('/create-list', payload)
			.then((response) => {
				setMessage(translate('response-200-created'));
				addNewList(response.data);
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

	return (
		<Background>
			<Container>
				<InnerContainer>
					<form>
						<h3 className="heading">{translate('createListHeading')}</h3>
						<input
							placeholder={translate('createListPlaceholder')}
							type="text"
							style={{ border: notIsValid ? '1px solid red' : '' }}
							onChange={validateInput}
							ref={listRef}
						/>
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
