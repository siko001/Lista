import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faShare, faClipboard, faTrash, faXmark, faClipboardCheck, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosClient from '../../axiosClient';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
	z-index: 999;
	position: fixed;
	border: 1px solid rgba(114, 109, 109, 0.548);
	left: 50%;
	transform: translate(100%);
	top: 50px;
	width: 200px;
	padding: 20px;
	border-radius: 10px;
	padding: 1.5rem;
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

		&__group {
			display: flex;
			gap: 10px;
			align-items: center;
		}
	}
	.setting2 {
		&:hover {
			color: blue;
			transition: 0.3s ease-in;
		}
	}
	.setting3 {
		&:hover {
			color: green;
			transition: 0.3s ease-in;
		}
	}
	.setting4 {
		&:hover {
			color: yellow;
			transition: 0.3s ease-in;
		}
	}
	.setting5 {
		&:hover {
			color: orange;
			transition: 0.3s ease-in;
		}
	}
	.setting6 {
		&:hover {
			color: red;
			transition: 0.3s ease-in;
		}
	}
	.setting7 {
		&:hover {
			background-color: yellow;
			transition: 0.3s ease-in;
			border-radius: 10px;
			width: 100%;
			text-align: center;
			padding: 0 10px;
		}
	}

	.close:hover {
		cursor: pointer;
		color: red;
	}
`;

const MainSettings = ({
	setOpenSettings,
	editTitle,
	setOpenEmptyListOverLay,
	product,
	listId,
	readyProducts,
	updateList,
	toBuyProducts,
	setToBuyProducts,
	setReadyProducts,
	setProduct,
	setSelectedProducts,
	setOpenEmptyAndDeleteListOverlay,
	setMessage,
}) => {
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

	//Setting No. 2

	//Handle The Share to A User (for the end)
	const handleShare = (id) => {
		const userID = localStorage.getItem('ACCESS_TOKEN');
		setOpenSettings((prev) => !prev);
		// Assuming listId and userId are available
		const data = {
			listId: id,
			userId: userID,
		};
		axiosClient
			.post('/share-list', data)
			.then((res) => {
				copyToClipBoard(res.data.link);
			})
			.catch((err) => {
		
			})
			.finally(() => {
				setTimeout(() => {}, 1600);
			});
	};

	const copyToClipBoard = (link) => {
		navigator.clipboard.writeText(link).then(() => {
			setMessage(`Copied to Clipboard ${link}`);
		});
	};

	// Setting No. 3 Mark All As Ready
	const handleMarkAllToBuyAsReady = (id) => {
		setOpenSettings((prev) => !prev);
		// Fetch all products
		const allProducts = JSON.parse(localStorage.getItem('allProductsInList' + id));
		const allLists = JSON.parse(localStorage.getItem('shoppingLists'));

		const correctList = allLists.find((list) => list.id == listId);
		// Update the count
		const total = correctList.totalProductCount;
		correctList.totalReadyProducts = total;
		localStorage.setItem('shoppingLists', JSON.stringify(allLists));
		// Fetch the ready products list (if any)
		const readyProductsList = JSON.parse(localStorage.getItem('readyProductsInList' + id)) || [];
		// Filter products that are not ready
		const notReadyProducts = allProducts.filter((p) => p.status !== 'ready');
		// Update the status of not ready products to 'ready' and add them to readyProductsList
		const updatedReadyProducts = notReadyProducts.map((p) => ({ ...p, status: 'ready' }));
		const newReadyProductsList = [...readyProductsList, ...updatedReadyProducts];
		// Update the status of all products to 'ready' in the allProductsList
		const updatedAllProducts = allProducts.map((p) => ({ ...p, status: 'ready' }));
		// Save the updated lists to localStorage
		localStorage.setItem('allProductsInList' + id, JSON.stringify(updatedAllProducts));
		localStorage.setItem('toBuyProductsInList' + id, '[]');
		localStorage.setItem('readyProductsInList' + id, JSON.stringify(newReadyProductsList));
		setToBuyProducts([]);
		setReadyProducts(newReadyProductsList);
		axiosClient
			.put('update/all-ready/' + id, id)
			.then((res) => {
				updateList();
			})
			.catch((err) => {
	
			})
			.finally(() => {});
	};

	// Setting 4 Revert everything back to the to buy list
	const handleRevertToBackToBuy = (id) => {
		setOpenSettings((prev) => !prev);
		// Fetch all products
		const allProducts = JSON.parse(localStorage.getItem('allProductsInList' + id));
		// Filter products that are  ready
		const readyProducts = allProducts.filter((p) => p.status == 'ready');

		const allLists = JSON.parse(localStorage.getItem('shoppingLists'));
		const correctList = allLists.find((list) => list.id == listId);
		// Update the count

		correctList.totalReadyProducts = 0;
		localStorage.setItem('shoppingLists', JSON.stringify(allLists));

		// Update the status of  ready products to 'no ready' and add them to readyProductsList
		const updatedProducts = readyProducts.map((p) => ({ ...p, status: 'to buy' }));
		const updatedProductsList = [...updatedProducts];

		// Update the status of all products to 'to buy' in the allProductsList
		const updatedAllProducts = allProducts.map((p) => ({ ...p, status: 'to buy' }));
		// Save the updated lists to localStorage
		localStorage.setItem('allProductsInList' + id, JSON.stringify(updatedAllProducts));
		localStorage.setItem('toBuyProductsInList' + id, JSON.stringify(updatedProductsList));
		localStorage.setItem('readyProductsInList' + id, '[]');
		setToBuyProducts(updatedAllProducts);
		setReadyProducts([]);
		axiosClient
			.put('update/all-to_buy/' + id, id)
			.then((res) => {})
			.catch((err) => {
			
			})
			.finally(() => {});
	};

	//Setting 5 Remove ONLY all Ready products from the List
	const handleRemoveReadyMarkedProducts = (id) => {
		setOpenSettings((prev) => !prev);
		// Fetch all products
		const allProducts = JSON.parse(localStorage.getItem('allProductsInList' + id));

		const allLists = JSON.parse(localStorage.getItem('shoppingLists'));
		const correctList = allLists.find((list) => list.id == listId);
		// Update the count
		const toDeductFromTotalList = correctList.totalReadyProducts;
		correctList.totalProductCount -= toDeductFromTotalList;
		correctList.totalReadyProducts = 0;
		localStorage.setItem('shoppingLists', JSON.stringify(allLists));

		// Fetch the ready products list (if any)
		const readyProductsList = JSON.parse(localStorage.getItem('readyProductsInList' + id)) || [];
		// Filter products that are  ready
		const readyProducts = allProducts.filter((p) => p.status == 'ready');
		// Remove ready products from allProducts
		const updatedAllProducts = allProducts.filter((product) => !readyProducts.includes(product));
		// Update the 'allProductsInList' in local storage with the new filtered array
		localStorage.setItem('allProductsInList' + id, JSON.stringify(updatedAllProducts));
		localStorage.setItem('readyProductsInList' + id, '[]');
		setReadyProducts([]);
		setSelectedProducts(updatedAllProducts);

		axiosClient
			.delete('remove/ready/' + id, id)
			.then((res) => {
				updateList();
			})
			.catch((err) => {
		
			})
			.finally(() => {});
	};

	const handleEmptyList = () => {
		setOpenEmptyListOverLay((prev) => !prev);
		setOpenSettings((prev) => !prev);
	};

	const handleDeleteListAndProducts = (id) => {
		//create a state annd overlay
		setOpenEmptyAndDeleteListOverlay((prev) => !prev);
		setOpenSettings((prev) => !prev);
	};

	return (
		<Container
			onMouseLeave={handleMouseOff}
			style={{ backgroundColor: darkMode ? '#161616' : '#fff', color: darkMode ? '#fff' : '#000' }}
		>
			{/* Rename Settings  1 */}
			<ul>
				<li className="setting-header">
					<div onClick={handleSettingRename} className="setting-header__group">
						<p className="largest">
							<FontAwesomeIcon icon={faPenSquare} />
						</p>
						<p className="bolder setting1">{translate('rename')}</p>
					</div>
					<p className="close largest" onClick={handleCloseSettings}>
						<FontAwesomeIcon icon={faXmark} />
					</p>
				</li>

				{/* Share the list and it's content 2*/}
				<li>
					<div
						onClick={() => {
							handleShare(listId);
						}}
						className="setting-header__group"
					>
						<p className="blue largest">
							<FontAwesomeIcon icon={faShare} />
						</p>
						<p className="bolder setting2">{translate('shareList')}</p>
					</div>
				</li>

				{/* Mark everything as That is set as to Buy, to as Ready 3 */}
				<li
					onClick={() => {
						handleMarkAllToBuyAsReady(listId);
					}}
					style={{ display: toBuyProducts[0] === undefined ? 'none' : 'block' }}
				>
					<div className="setting-header__group">
						<p className="green largest">
							<FontAwesomeIcon icon={faClipboardCheck} />
						</p>
						<p className="bolder setting3">{translate('mark-all-ready')}</p>
					</div>
				</li>

				{/* Revert 	all ready products Back to To buy 4*/}
				<li
					onClick={() => {
						handleRevertToBackToBuy(listId);
					}}
					style={{ display: readyProducts.length <= 0 ? 'none' : 'block' }}
				>
					<div className="setting-header__group long">
						<p className="yellow largest">
							<FontAwesomeIcon icon={faClipboard} />
						</p>
						<p className="bolder setting4">{translate('mark-all-unready')}</p>
					</div>
				</li>

				{/* Empty the List From The Ready products Only 5*/}
				<li
					onClick={() => {
						handleRemoveReadyMarkedProducts(listId);
					}}
					style={{ display: readyProducts.length <= 0 ? 'none' : 'block' }}
				>
					<div className="setting-header__group">
						<p className="orange largest">
							<FontAwesomeIcon icon={faShare} />
						</p>
						<p className="bolder setting5">{translate('remove-all-ready')}</p>
					</div>
				</li>

				{/* empty the list from all products Ready or Not 6*/}
				<li
					style={{ display: product[0] == undefined && readyProducts.length == '0' ? 'none' : 'block' }}
					onClick={product[0] == undefined && readyProducts.length == '0' ? null : handleEmptyList}
				>
					<div className={`setting-header__group`}>
						<p className="red largest">
							<FontAwesomeIcon icon={faSquareXmark} />
						</p>
						<p className="bolder setting6">{translate('empty-list')}</p>
					</div>
				</li>

				{/* Delete the List and it's content 7*/}
				<li>
					<div
						onClick={() => {
							handleDeleteListAndProducts(listId);
						}}
						className={`setting-header__group setting7`}
						style={{ color: 'red ' }}
					>
						<p className="largest">
							<FontAwesomeIcon icon={faTrash} />
						</p>
						<p className="bolder">{product[0] == undefined ? translate('deleteList') : translate('empty-list-and-delete')}</p>
					</div>
				</li>
			</ul>
		</Container>
	);
};

export default MainSettings;
