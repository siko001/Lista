import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ListSetting from './ListSetting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../contexts/LanguageContext';
import axiosClient from '../axiosClient';

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
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
	height: 60%;
	width: 90%;
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
`;
const Bottom = styled.div`
	width: 100%;
	height: 8px;
	border-radius: 5px;
	background-color: #a2a2a238;
`;

const List = ({ darkMode, setDeleteOverlay, setMessage, name, listID, setDeleteID, setDeleteTitle, setStatus, fetchLists }) => {
	const [title, setTitle] = useState(name);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [settingPageOpen, setSettingPageOpen] = useState(false);
	const inputRef = useRef(null);
	const { translate } = useLanguage();

	const editTitle = () => {
		setIsEditingTitle(true);
	};

	const saveTitle = (e) => {
		const newTitle = e.target.value;
		const id = listID;
		axiosClient
			.put(`/update-list-title/${id}`, { title: newTitle })
			.then((res) => {
				setTitle(e.target.value);
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
		if (isEditingTitle) {
			inputRef.current.focus();
		}
	}, [isEditingTitle]);
	return (
		<Container style={{ backgroundColor: darkMode ? '#161616' : '#fff' }}>
			<Content>
				<Top>
					<div className="left">
						{!isEditingTitle ? (
							<p onClick={editTitle}>{title || 'list' + ' ' + listID} </p>
						) : (
							<input style={{ color: darkMode ? '#fff' : '#000' }} onBlur={saveTitle} defaultValue={title} ref={inputRef} />
						)}
					</div>
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
								/>
							)}
						</div>
					</div>
				</Top>
				<Bottom></Bottom>
			</Content>
		</Container>
	);
};

export default List;
