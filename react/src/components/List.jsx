import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ListSetting from './ListSetting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../contexts/LanguageContext';
import axiosClient from '../axiosClient';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
	border: 1px solid rgba(114, 109, 109, 0.548);
	width: 95%;
	max-width: 850px;
	height: 70px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	@media screen and (max-width: 950px) {
		max-width: 400px;
	}
	.leftSpace {
		width: 50%;
		height: 100%;
	}

	.rightSpace {
		width: 50%;
		height: 100%;
	}
	.aboveSpace {
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

		width: 100%;
		min-height: 23px;
	}
`;
const Top = styled.div`
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.left {
		font-weight: 700;
		font-size: 1.2rem;
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
	}
`;
const Bottom = styled.div`
	width: 100%;
	min-height: 8px;
	border-radius: 5px;
	background-color: #a2a2a238;
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
}) => {
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
		<Container style={{ backgroundColor: darkMode ? '#161616' : '#fff' }}>
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
						<div className="quantity">0/0</div>
						<div className="settings">
							<FontAwesomeIcon icon={faGears} onClick={handelOpenSettingPage} />
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
								/>
							)}
						</div>
					</div>
				</Top>
				<Bottom></Bottom>
				<div onClick={handleOpenList} className="underbottom"></div>
			</Content>
			<div onClick={handleOpenList} className="rightSpace"></div>
		</Container>
	);
};

export default List;
