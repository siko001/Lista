import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	border: 1px solid white;
	width: 60%;
	min-height: 200px;
	@media screen and (max-width: 950px) {
		width: 90%;
	}
`;

const ListContainer = () => {
	return <Container></Container>;
};

export default ListContainer;
