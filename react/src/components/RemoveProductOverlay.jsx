import React from 'react';

import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import axiosClient from '../axiosClient';

const Background = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	z-index: 1;
	top: 0px;
	background-color: rgba(0, 0, 0, 0.7);
	width: 100%;
	height: 100%;

	@media screen and (max-width: 960px) {
		display: block;
	}
`;

const Container = styled.div`
	border: 1px solid white;
	margin: 20px auto;
	width: 300px;
	background-color: #fff;
	border-radius: 8px;
	align-items: center;
	justify-content: center;
	@media screen and (max-width: 960px) {
		top: 20px;
		width: 90%;
	}
`;

const InnerContainer = styled.div`
	padding: 30px 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	text-align: center;

	.group {
		display: flex;
		justify-content: space-between;
		width: 80%;

		button {
			width: 48%;
			font-size: 0.9rem;
			font-weight: 500;
			letter-spacing: 0.8px;
		}
	}
	h3 {
		font-size: 1.5rem;
		color: #333;
	}
`;
const RemoveProductOverlay = ({ productToRemove, listTitle, setRemoveProduct, setProduct }) => {
	const { translate } = useLanguage();

	const close = () => {
		setRemoveProduct((prev) => !prev);
	};

	const handleRemoveProduct = (product) => {};
	return (
		<Background>
			<Container>
				<InnerContainer>
					<h3 className="heading">
						{translate('deleteProductOverlay')} {productToRemove} <br></br>
						{translate('deleteProductOverlayPt2')} {listTitle}
					</h3>
					<hr></hr>
					<div className="group">
						<button className="btn" onClick={close}>
							{translate('cancel-btn')}
						</button>
						<button onClick={handleRemoveProduct} className="btn btn-main red-bg">
							{translate('remove-btn')}
						</button>
					</div>
				</InnerContainer>
			</Container>
		</Background>
	);
};

export default RemoveProductOverlay;
