import React, { useState, useRef, useEffect, useContext } from 'react';
import styled, { css, keyframes } from 'styled-components';
import ListSetting from './ListSetting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../contexts/LanguageContext';
import axiosClient from '../axiosClient';
import { useNavigate } from 'react-router-dom';
import { useProductCount } from '../contexts/ProductCountContext';

const Container = styled.div`
	position: relative;
	border: 1px solid rgba(114, 109, 109, 0.548);
	width: 100%;
	max-width: 850px;
	height: 70px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		transition: transform 1s ease-in;
		transform: scale(1.05);
	}
	&:not(:hover) {
		transition: transform 0.3s ease-out;
		transform: scale(1);
	}
	@media screen and (max-width: 950px) {
		max-width: 600px;
		margin: 0 auto;
	}
	@media screen and (max-width: 650px) {
		max-width: 400px;
	}
	.leftSpace {
		cursor: pointer;
		width: 50%;
		height: 100%;
	}

	.rightSpace {
		cursor: pointer;
		width: 50%;
		height: 100%;
	}
	.aboveSpace {
		cursor: pointer;
		margin-top: -15px;
		width: 100%;
		min-height: 10px;
	}
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
	height: 60%;
	min-width: 90%;
	max-width: 90%;

	.underbottom {
		margin-top: -15px;
		cursor: pointer;
		width: 100%;
		min-height: 23px;
	}
`;
const Top = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	.left {
		font-weight: 700;
		font-size: 1.2rem;
		&:hover {
			color: rgba(16, 16, 255, 0.6);
		}
	}

	input {
		background-color: transparent;
		border: none;
		outline: none;
	}

	.right {
		margin-right: 15px;
		width: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;

		.quantity {
			font-size: 0.8rem;
			color: gray;
		}

		.settings {
			display: flex;
			justify-content: center;
			align-items: center;
			color: gray;
			width: 30px;
			height: 25px;
			border-radius: 50%;
		}
		.settings:hover {
			background-color: #80808044;
		}
	}
	.center {
		flex: 1;
		min-width: 20px;
		margin: -12px 0 0 10px;
		height: 42px;
		cursor: pointer;
	}
`;

const Bottom = styled.div`
	width: 100%;
	min-height: 8px;
	border-radius: 5px;
	background-color: #a2a2a238;
	position: relative;

	.filler {
		width: ${(props) => (props.percentage === NaN ? '0' : `${props.percentage}%`)};
		height: 100%;
		border-radius: 5px;
		background-color: green;
		position: absolute;
		top: 0;
		left: 0;
	}
`;

const List = ({
	darkMode,
	setDeleteOverlay,
	setMessage,
	name,
	listID,
	setDeleteID,
	setDeleteTitle,
	setStatus,
	fetchLists,
	setCopyLoader,
	totalReadyProduct,
	totalProducts,
	newList,
	newListId,
	listAboutToDelete,
	deleteID,
	setNewList,
	setNewListId,
	newListB,
	setNewListB,
}) => {
	const percentage = (totalReadyProduct / totalProducts) * 100;
	const [title, setTitle] = useState(name);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [settingPageOpen, setSettingPageOpen] = useState(false);
	const inputRef = useRef(null);
	const { translate } = useLanguage();
	const navigate = useNavigate();

	const titleReplacment = 'list' + ' ' + listID;

	const editTitle = () => {
		setIsEditingTitle(true);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			saveTitle(e);
		}
	};

	const saveTitle = (e) => {
		const newTitle = e.target.value.slice(0, 25);
		const id = listID;

		axiosClient
			.put(`/update-list-title/${id}`, { title: newTitle })
			.then((res) => {
				setTitle(newTitle);

				// Update the title in local storage
				let allLists = localStorage.getItem('shoppingLists');
				// Assuming allLists is a string representation of JSON data, parse it into an array
				allLists = JSON.parse(allLists) || [];
				const updatedLists = allLists.map((list) => {
					if (list.id === id) {
						// Update the title for the matching list
						return { ...list, name: newTitle };
					}
					return list;
				});
				// Save the updated data back to local storage
				localStorage.setItem('shoppingLists', JSON.stringify(updatedLists));

				setIsEditingTitle(false);
				setMessage(translate('notification-rename'));
				setTimeout(() => {
					setMessage(null);
				}, 1600);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {});
	};

	const handelOpenSettingPage = () => {
		setSettingPageOpen((prev) => !prev);
	};

	useEffect(() => {
		const inputElement = inputRef.current;

		if (isEditingTitle && inputElement) {
			inputElement.focus();
			inputElement.addEventListener('keypress', handleKeyPress);

			return () => {
				inputElement.removeEventListener('keypress', handleKeyPress);
			};
		}
	}, [isEditingTitle]);

	const handleOpenList = () => {
		const id = listID;
		const listName = title == null ? titleReplacment : title;
		const listUrl = `/${listName}/${id}`;
		navigate(listUrl);
	};

	return (
		<>
			{settingPageOpen && (
				<ListSetting
					darkMode={darkMode}
					setSettingPageOpen={setSettingPageOpen}
					setDeleteOverlay={setDeleteOverlay}
					setIsEditingTitle={setIsEditingTitle}
					setMessage={setMessage}
					listID={listID}
					setDeleteID={setDeleteID}
					setDeleteTitle={setDeleteTitle}
					title={title}
					setStatus={setStatus}
					fetchLists={fetchLists}
					setCopyLoader={setCopyLoader}
					setNewList={setNewList}
					setNewListId={setNewListId}
					setNewListB={setNewListB}
				/>
			)}
			<Container
				style={{
					backgroundColor: darkMode ? '#161616' : '#fff',
					border:
						newListB && newListId == listID ? '2px solid green' : listAboutToDelete && deleteID == listID ? '2px solid red' : '',
					opacity: listAboutToDelete && deleteID == listID ? '0' : newList && newListId == listID ? '1' : '',
					transition: 'opacity 1s, top 2s, transform 0.5s ',
					top: listAboutToDelete && deleteID == listID ? '200px' : newList && newListId == listID ? '-100px' : '0',
					transitionDelay: listAboutToDelete && deleteID === listID ? '1s' : newList && newListId == listID ? '1s' : '',
				}}
			>
				<div onClick={handleOpenList} className="leftSpace"></div>
				<Content>
					<div onClick={handleOpenList} className="aboveSpace"></div>
					<Top>
						<div className="left">
							{!isEditingTitle ? (
								<p onClick={editTitle}>{title || titleReplacment} </p>
							) : (
								<input
									style={{ color: darkMode ? '#fff' : '#000' }}
									maxLength={20}
									onBlur={saveTitle}
									defaultValue={title}
									ref={inputRef}
								/>
							)}
						</div>
						<div onClick={handleOpenList} className="center"></div>
						<div className="right">
							<div className="quantity">
								{totalReadyProduct}/{totalProducts}
							</div>
							<div className="settings">
								<FontAwesomeIcon icon={faGears} onClick={handelOpenSettingPage} />
							</div>
						</div>
					</Top>

					<Bottom percentage={percentage}>
						<div className="filler"></div>
					</Bottom>
					<div onClick={handleOpenList} className="underbottom"></div>
				</Content>
				<div onClick={handleOpenList} className="rightSpace"></div>
			</Container>
		</>
	);
};

export default List;
