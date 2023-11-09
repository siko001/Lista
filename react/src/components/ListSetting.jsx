import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faShare, faClipboard, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../contexts/LanguageContext';
import axiosClient from '../axiosClient';

const Container = styled.div`
	z-index: 1;
	position: absolute;
	border: 1px solid rgba(114, 109, 109, 0.548);
	right: -0px;
	top: 40px;
	width: 200px;
	padding: 20px;

	ul {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	li p:hover {
		cursor: pointer;
	}

	.setting-header {
		display: flex;
		justify-content: space-between;
		&__group {
			display: flex;
			gap: 10px;
		}
	}

	.close:hover {
		cursor: pointer;
	}
`;

const ListSetting = ({
	darkMode,
	setSettingPageOpen,
	setDeleteOverlay,
	setIsEditingTitle,
	setMessage,
	listID,
	setDeleteID,
	setDeleteTitle,
	title,
	setStatus,
	fetchLists,
}) => {
	const [isVisible, setIsVisible] = useState(true);
	const ref = useRef();
	const { translate } = useLanguage();

	const handleClickOutside = (event) => {
		if (ref.current && !ref.current.contains(event.target)) {
			setIsVisible(false);
			setSettingPageOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleCloseSettings = () => {
		setIsVisible(false);
		setSettingPageOpen(false);
	};

	//Handle Rename of the List
	const handleRename = () => {
		setIsEditingTitle(true);
		setSettingPageOpen(false);
	};

	//Handle the copy of a list
	const handleCopy = (ID) => {
		setSettingPageOpen(false);
		axiosClient
			.post(`list/copy/${ID}`, ID)
			.then(() => {
				fetchLists();
				setMessage(translate('notification-copied'));
			})
			.catch((err) => {
				setStatus(400);
				setMessage(translate('notification-copied-fail'));
			})
			.finally(() => {
				setTimeout(() => {
					setStatus(null);
					setMessage(null);
				}, 1600);
			});
	};

	//Handle The Share to A User (for the end)
	const handleShare = () => {
		setSettingPageOpen(false);
		setMessage(translate('notification-shared'));
		setTimeout(() => {
			setMessage(null);
		}, 1600);
	};

	//Handle The Delete
	const handleDelete = (ID) => {
		setDeleteID(ID);
		setDeleteOverlay(true);
		setIsVisible(false);
		setDeleteTitle(title);
	};

	return (
		<>
			{isVisible && (
				<Container ref={ref} style={{ backgroundColor: darkMode ? '#161616' : '#fff', color: darkMode ? '#fff' : '#000' }}>
					<ul>
						<li className="setting-header">
							<div className="setting-header__group" onClick={handleRename}>
								<p>
									<FontAwesomeIcon icon={faPenSquare} />
								</p>
								<p> {translate('rename')}</p>
							</div>
							<p className="close" onClick={handleCloseSettings}>
								<FontAwesomeIcon icon={faXmark} />
							</p>
						</li>
						<li>
							<div className="setting-header__group" onClick={() => handleCopy(listID)}>
								<p>
									<FontAwesomeIcon icon={faClipboard} />
								</p>
								<p> {translate('copyList')}</p>
							</div>
						</li>
						<li>
							<div className="setting-header__group" onClick={handleShare}>
								<p>
									<FontAwesomeIcon icon={faShare} />
								</p>
								<p>{translate('shareList')}</p>
							</div>
						</li>
						<li>
							<div className="setting-header__group red" onClick={() => handleDelete(listID)}>
								<p>
									<FontAwesomeIcon icon={faTrash} />
								</p>
								<p>{translate('deleteList')}</p>
							</div>
						</li>
					</ul>
				</Container>
			)}
		</>
	);
};

export default ListSetting;
