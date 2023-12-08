import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faShare, faClipboard, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosClient from '../../axiosClient';

const Container = styled.div`
	z-index: 9;
	position: absolute;
	border: 1px solid rgba(114, 109, 109, 0.548);
	right: -0px;
	top: 0px;
	width: 200px;
	padding: 20px;
	z-index: 999 !important;
	border-radius: 10px;

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
	setCopyLoader,
	setNewList,
	setNewListId,
	setNewListB,
	setShare,
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
		setCopyLoader(true);
		setNewListB(true);
		const user = localStorage.getItem('ACCESS_TOKEN');

		axiosClient
			.post(`list/copy/${ID}/${user}`, ID)
			.then((response) => {
				// Fetch the existing lists from local storage
				let allLists = localStorage.getItem('shoppingLists');
				allLists = JSON.parse(allLists) || [];
				// Append the copied list to the existing lists
				allLists.push(response.data);
				setNewListId(response.data.id);
				setNewList(response.data);

				// Update the local storage with the new list
				localStorage.setItem('shoppingLists', JSON.stringify(allLists));

				// Fetch the lists again (if needed)
				fetchLists();
				setMessage(translate('notification-copied'));
			})
			.catch((err) => {
				setStatus(400);
				setMessage(translate('notification-copied-fail'));
			})
			.finally(() => {
				setCopyLoader(false);
				setTimeout(() => {
					setStatus(null);
					setMessage(null);
				}, 1600);
				setTimeout(() => {
					setNewListB(false);
					setNewListId(false);
				}, 5000);
				return setTimeout(() => {
					setNewList(false);
				}, 300);
			});
	};

	//Handle The Share to A User (for the end)
	const handleShare = () => {
		const userID = localStorage.getItem('ACCESS_TOKEN');
		setSettingPageOpen(false);

		// Assuming listId and userId are available
		const data = {
			listId: listID,
			userId: userID,
		};
		axiosClient
			.post('/share-list', data)
			.then((res) => {
				copyToClipBoard(res.data.link);
				setShare(true);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setTimeout(() => {
					setMessage(null);
					setShare(false);
				}, 1600);
			});
	};

	const copyToClipBoard = (link) => {
		navigator.clipboard.writeText(link).then(() => {
			setMessage(`${translate('copied-to-clipboared')} ${link}`);
		});
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
						<li className="setting-header setting-step-1">
							<div className="setting-header__group" onClick={handleRename}>
								<p>
									<FontAwesomeIcon icon={faPenSquare} />
								</p>
								<p> {translate('rename')}</p>
							</div>
							<p className="close list-exit" onClick={handleCloseSettings}>
								<FontAwesomeIcon icon={faXmark} />
							</p>
						</li>
						<li>
							<div className="setting-header__group setting-step-2" onClick={() => handleCopy(listID)}>
								<p>
									<FontAwesomeIcon icon={faClipboard} />
								</p>
								<p> {translate('copyList')}</p>
							</div>
						</li>
						<li>
							<div className="setting-header__group setting-step-3" onClick={handleShare}>
								<p>
									<FontAwesomeIcon icon={faShare} />
								</p>
								<p>{translate('shareList')}</p>
							</div>
						</li>
						<li>
							<div className="setting-header__group red setting-step-4" onClick={() => handleDelete(listID)}>
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
