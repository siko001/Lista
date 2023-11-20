import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faShare, faClipboard, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../contexts/LanguageContext';
import axiosClient from '../axiosClient';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useNavigate } from 'react-router-dom';

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

const MainSettings = ({ setOpenSettings, editTitle, setOpenEmptyListOverLay, product, listId, readyProducts, updateList, toBuyProducts }) => {
	const { darkMode } = useDarkMode();
	const { translate } = useLanguage();
	const navigate = useNavigate();

	const handleMouseOff = () => {
		setOpenSettings((prev) => !prev);
	};

	// Setting No. 1 (close)
	const handleCloseSettings = () => {
		setOpenSettings((prev) => !prev);
	};

	// Setting No. 1
	const handleSettingRename = () => {
		setOpenSettings((prev) => !prev);
		editTitle();
	};

	// Setting No. 2
	const handleMarkAllToBuyAsReady = (id) => {
		// Fetch all products
		// const allProducts = JSON.parse(localStorage.getItem('allProductsInList' + id));

		// // Fetch the to buy products list (if any)
		// const toBuyProductsList = JSON.parse(localStorage.getItem('toBuyProductsInList' + id)) || [];

		// // Fetch the ready products list (if any)
		// const readyProductsList = JSON.parse(localStorage.getItem('readyProductsInList' + id)) || [];

		// // Filter products that are not ready
		// const notReadyProducts = allProducts.filter((p) => p.status !== 'ready');

		// // Update the status of not ready products to 'ready' and add them to readyProductsList
		// const updatedReadyProducts = notReadyProducts.map((p) => ({ ...p, status: 'ready' }));
		// const newReadyProductsList = [...readyProductsList, ...updatedReadyProducts];

		// // Move products from toBuyProductsList to readyProductsList with status 'ready'
		// const updatedToBuyProducts = toBuyProductsList.map((p) => ({ ...p, status: 'ready' }));
		// const newReadyProductsListWithToBuy = [...newReadyProductsList, ...updatedToBuyProducts];

		// // Update the status of all products to 'ready' in the allProductsList
		// const updatedAllProducts = allProducts.map((p) => ({ ...p, status: 'ready' }));

		// // Save the updated lists to localStorage
		// localStorage.setItem('allProductsInList' + id, JSON.stringify(updatedAllProducts));
		// localStorage.setItem('toBuyProductsInList' + id, '[]');
		// localStorage.setItem('readyProductsInList' + id, JSON.stringify(newReadyProductsListWithToBuy));

		axiosClient
			.put('update/all-ready/' + id, id)
			.then((res) => {
				console.log(res.data.message);
				updateList();
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {});
	};

	const handleRevertToBackToBuy = (id) => {
		axiosClient
			.put('update/all-to_buy/' + id, id)
			.then((res) => {
				updateList();
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {});
	};

	//Remove ONLY all Ready products from the List
	const handleRemoveReadyMarkedProducts = (id) => {
		axiosClient
			.delete('remove/ready/' + id, id)
			.then((res) => {
				updateList();
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {});
	};

	const handleEmptyList = () => {
		setOpenEmptyListOverLay((prev) => !prev);
		setOpenSettings((prev) => !prev);
	};

	const handleDeleteListAndProducts = (id) => {
		axiosClient
			.delete(`/delete/all-products/and-list${id}`, id)
			.then((res) => {
				console.log(res.data);
				const homeUrl = '/';
				navigate(homeUrl);
			})
			.then((err) => {
				console.log(err.message);
			})
			.finally(() => {});
	};

	// const handleMarkAllToBuyAsReady = (listId) => {
	// 	const allProductsList = localStorage.getItem(`allProductsInList${listId}`);

	// 	const toBuyList = localStorage.getItem(`toBuyProductsInList${listId}`);

	// 	const allProductListThatAreToBuy = allProductsList.filter((p) => p.status != 'ready');

	// 	console.log(allProductListThatAreToBuy);
	// };

	return (
		<Container
			onMouseLeave={handleMouseOff}
			style={{ backgroundColor: darkMode ? '#161616' : '#fff', color: darkMode ? '#fff' : '#000' }}
		>
			{/* Rename Settings  1 */}
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

				{/* Mark everything as That is set as to Buy, to as Ready 2 */}
				<li
					onClick={() => {
						handleMarkAllToBuyAsReady(listId);
					}}
					style={{ display: toBuyProducts[0] === undefined ? 'none' : 'block' }}
				>
					<div className="setting-header__group">
						<p>
							<FontAwesomeIcon icon={faClipboard} />
						</p>
						<p>{translate('mark-all-ready')}</p>
					</div>
				</li>

				{/* Revert 	all ready products Back to To buy 3*/}
				<li
					onClick={() => {
						handleRevertToBackToBuy(listId);
					}}
					style={{ display: readyProducts.length <= 0 ? 'none' : 'block' }}
				>
					<div className="setting-header__group long">
						<p>
							<FontAwesomeIcon icon={faClipboard} />
						</p>
						<p>{translate('mark-all-unready')}</p>
					</div>
				</li>

				{/* Empty the List From The Ready products Only */}
				<li
					onClick={() => {
						handleRemoveReadyMarkedProducts(listId);
					}}
					style={{ display: readyProducts.length <= 0 ? 'none' : 'block' }}
				>
					<div className="setting-header__group">
						<p>
							<FontAwesomeIcon icon={faShare} />
						</p>
						<p>{translate('remove-all-ready')}</p>
					</div>
				</li>

				{/* empty the list from all products Ready or Not*/}
				<li
					style={{ display: product[0] == undefined && readyProducts.length == '0' ? 'none' : 'block' }}
					onClick={product[0] == undefined && readyProducts.length == '0' ? null : handleEmptyList}
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
					<div
						onClick={() => {
							handleDeleteListAndProducts(listId);
						}}
						className={`setting-header__group `}
						style={{ color: 'red ' }}
					>
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
