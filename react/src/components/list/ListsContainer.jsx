import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import List from './List';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 0;
	position: relative;
	width: 50%;
	min-height: 200px;
	gap: 20px;
	margin-top: 50px;
	@media screen and (max-width: 950px) {
		width: 90%;
	}

	.settingHook {
		width: 100%;
		position: relative;
	}
`;

const ListContainer = ({
	darkMode,
	setDeleteOverlay,
	setMessage,
	lists,
	setDeleteID,
	setDeleteTitle,
	setStatus,
	fetchLists,
	setCopyLoader,
	newList,
	newListId,
	listAboutToDelete,
	deleteID,
	setNewList,
	setNewListId,
	newListB,
	setNewListB,
	setShare,
}) => {
	const handleDeleteOverlay = (deleteOverlayState) => {
		setDeleteOverlay(deleteOverlayState);
	};
	// Reverse the lists array to display the latest list at the bottom
	const reversedLists = lists.slice().reverse();

	return (
		<Container>
			{reversedLists.map((list) => (
				<div key={list.id} className="settingHook">
					<List
						key={list.id}
						darkMode={darkMode}
						setDeleteOverlay={handleDeleteOverlay}
						setMessage={setMessage}
						name={list.name}
						listID={list.id}
						setDeleteID={setDeleteID}
						setDeleteTitle={setDeleteTitle}
						setStatus={setStatus}
						fetchLists={fetchLists}
						setCopyLoader={setCopyLoader}
						totalProducts={list.totalProductCount}
						totalReadyProduct={list.totalReadyProducts}
						newList={newList}
						newListId={newListId}
						listAboutToDelete={listAboutToDelete}
						deleteID={deleteID}
						setNewListId={setNewListId}
						setNewList={setNewList}
						newListB={newListB}
						setNewListB={setNewListB}
						setShare={setShare}
					/>
				</div>
			))}
		</Container>
	);
};

export default ListContainer;
