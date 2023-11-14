import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import List from './List';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	width: 60%;
	min-height: 200px;
	gap: 20px;
	margin-top: 50px;
	@media screen and (max-width: 950px) {
		width: 90%;
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
}) => {
	const handleDeleteOverlay = (deleteOverlayState) => {
		setDeleteOverlay(deleteOverlayState);
	};
	// Reverse the lists array to display the latest list at the bottom
	const reversedLists = lists.slice().reverse();

	return (
		<Container>
			{reversedLists.map((list) => (
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
				/>
			))}
		</Container>
	);
};

export default ListContainer;
