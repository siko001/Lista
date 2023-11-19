import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faShare, faClipboard, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../contexts/LanguageContext';
import axiosClient from '../axiosClient';
import { useDarkMode } from '../contexts/DarkModeContext';

const Container = styled.div`
	z-index: 999;
	position: absolute;
	border: 1px solid rgba(114, 109, 109, 0.548);
	left: 50%;
	transform: translate(100%);
	top: 50px;
	width: 200px;
	padding: 20px;
	@media screen and (max-width: 750px) {
		right: -50px;

		transform: translate(10%);
	}
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
		text-align: center;

		&__group {
			display: flex;
			gap: 10px;
			align-items: center;
		}
	}

	.close:hover {
		cursor: pointer;
	}
`;

const MainSettings = ({ setOpenSettings, editTitle, setOpenEmptyListOverLay, product }) => {
	const { darkMode } = useDarkMode();
	const { translate } = useLanguage();

	const handleMouseOff = () => {
		setOpenSettings((prev) => !prev);
	};

	const handleCloseSettings = () => {
		setOpenSettings((prev) => !prev);
	};

	const handleSettingRename = () => {
		setOpenSettings((prev) => !prev);
		editTitle();
	};

	const handleEmptyList = () => {
		setOpenEmptyListOverLay((prev) => !prev);
		setOpenSettings((prev) => !prev);
	};

	return (
		<Container
			onMouseLeave={handleMouseOff}
			style={{ backgroundColor: darkMode ? '#161616' : '#fff', color: darkMode ? '#fff' : '#000' }}
		>
			<ul>
				<li className="setting-header">
					<div onClick={handleSettingRename} className="setting-header__group">
						<p>
							<FontAwesomeIcon icon={faPenSquare} />
						</p>
						<p>{translate('rename')}</p>
					</div>
					<p className="close" onClick={handleCloseSettings}>
						<FontAwesomeIcon icon={faXmark} />
					</p>
				</li>
				<li style={{ display: product[0] === undefined ? 'none' : 'block' }}>
					<div className="setting-header__group">
						<p>
							<FontAwesomeIcon icon={faClipboard} />
						</p>
						<p>{translate('mark-all-ready')}</p>
					</div>
				</li>

				<li style={{ display: product[0] === undefined ? 'none' : 'block' }}>
					<div className="setting-header__group long">
						<p>
							<FontAwesomeIcon icon={faClipboard} />
						</p>
						<p>{translate('mark-all-unready')}</p>
					</div>
				</li>
				<li style={{ display: product[0] === undefined ? 'none' : 'block' }}>
					<div className="setting-header__group">
						<p>
							<FontAwesomeIcon icon={faShare} />
						</p>
						<p>{translate('remove-all-ready')}</p>
					</div>
				</li>

				{/* empty the list frpm products */}
				<li
					style={{ display: product[0] === undefined ? 'none' : 'block' }}
					onClick={product[0] === undefined ? null : handleEmptyList}
				>
					<div className={`setting-header__group ${product[0] === undefined ? 'red' : 'red'}`}>
						<p>
							<FontAwesomeIcon icon={faTrash} />
						</p>
						<p>{translate('empty-list')}</p>
					</div>
				</li>

				{/* Share the list and it's content */}
				<li>
					<div className="setting-header__group">
						<p>
							<FontAwesomeIcon icon={faShare} />
						</p>
						<p>{translate('shareList')}</p>
					</div>
				</li>

				{/* Delete the List and it's content */}
				<li>
					<div className={`setting-header__group `} style={{ color: 'red ' }}>
						<p>
							<FontAwesomeIcon icon={faTrash} />
						</p>
						<p>{product[0] == undefined ? translate('deleteList') : translate('empty-list-and-delete')}</p>
					</div>
				</li>
			</ul>
		</Container>
	);
};

export default MainSettings;
