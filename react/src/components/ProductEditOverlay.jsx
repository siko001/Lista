import React from 'react';
import styled from 'styled-components';
import { useDarkMode } from '../contexts/DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
`;
const ContentContainer = styled.div`
	position: relative;
	margin: 0 auto;
	height: 100vh;
	width: 65%;
	span {
		position: absolute;
		right: 15px;
		top: 15px;
		font-size: 2rem;

		&:hover {
			color: red;
			cursor: pointer;
		}
	}
	@media screen and (max-width: 950px) {
		width: 75%;
	}
	@media screen and (max-width: 770px) {
		margin: 0;
		width: 100%;
	}

	form {
		height: 100%;
		width: 90%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		margin: 0 auto;

		h1 {
			text-align: center;
			margin-top: 15px;
		}
		h1:nth-child(2n) {
			margin-bottom: 40px;
		}

		h2 {
			margin-bottom: 10px;
			text-decoration: underline;
			text-align: center;
		}

		.grp {
			display: flex;
			margin: 0 auto 30px;
			gap: 20px;
			justify-content: center;
			.input-grp {
				display: flex;
				flex-direction: column;
				gap: 2px;
			}
			label {
				font-size: 1.3rem;
			}
			input {
				width: 100%;
				min-width: 200px;
				min-height: 25px;

				background-color: #585858;
				color: white;
				font-size: 1rem;
				padding: 5px 0 5px 10px;
				@media screen and (max-width: 750px) {
					min-width: 100px;
				}
			}
			select {
				min-height: 25px;
				min-width: 50px;
				background-color: #585858;
				color: white;
			}

			button {
				font-size: 1rem;
				font-weight: 600;
				color: white;
			}
			.cancle {
				background-color: red;
			}
			.save {
				background-color: green;
			}
		}
	}
`;

const ProductEditOverlay = ({ setOpenEditProduct, productToEdit }) => {
	const { darkMode } = useDarkMode();
	console.log(productToEdit);
	const handleClose = () => {
		setOpenEditProduct((prev) => !prev);
	};

	return (
		<Container style={{ backgroundColor: darkMode ? 'white' : 'black' }}>
			<ContentContainer style={{ backgroundColor: darkMode ? 'black' : 'white' }}>
				<span onClick={handleClose}>
					<FontAwesomeIcon icon={faXmark} />
				</span>
				<form>
					<h1>Edit Product</h1>
					<h1>Name</h1>
					<h2>Name</h2>
					<div className="grp">
						<div className="input-grp">
							<label>English</label>
							<input />
						</div>
						<div className="input-grp">
							<label>Maltese</label>
							<input />
						</div>
					</div>
					<h2>Category</h2>
					<div className="grp">
						<div className="input-grp">
							<label>English</label>
							<input />
						</div>
						<div className="input-grp">
							<label>Maltese</label>
							<input />
						</div>
					</div>
					<h2>Quantity & Unit</h2>
					<div className="grp">
						<div className="input-grp">
							<input />
						</div>
						<div className="input-grp">
							<select>
								<option>KG</option>
								<option>Grams</option>
								<option>L</option>
								<option>ML</option>
								<option>Pcs</option>
							</select>
						</div>
					</div>
					<h2>Price</h2>
					<div className="grp">
						<div className="input-grp">
							<input className="" />
						</div>
					</div>
					<div className="grp">
						<button onClick={handleClose} className="btn cancle">
							Cancel
						</button>
						<button className="btn save">Save</button>
					</div>
				</form>
			</ContentContainer>
		</Container>
	);
};

export default ProductEditOverlay;
