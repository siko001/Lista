import React, { useState } from 'react';
import styled from 'styled-components';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import axiosClient from '../../axiosClient';

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
				min-height: 29px;
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

const ProductEditOverlay = ({ setOpenEditProduct, productToEdit, item, listId, updateList, getMyProducts }) => {
	const product = productToEdit;
	const [formData, setFormData] = useState({
		nameEN: product.name['en'] || product.nameEn || product.name.en, //not this
		nameMT: product.name['mt'],
		categoryEN: product.category['en'],
		categoryMT: product.category['mt'],
		quantity: product.quantity,
		unit: product.unit,
		price: product.price,
	});
	const { language, translate } = useLanguage();
	const { darkMode } = useDarkMode();

	const handleClose = () => {
		setOpenEditProduct((prev) => !prev);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		const userId = localStorage.getItem('ACCESS_TOKEN');
		e.preventDefault();

		{
			// Retrieve the existing product from localStorage
			const allProductsList = JSON.parse(localStorage.getItem('allProductsInList' + listId));
			const toBuyList = JSON.parse(localStorage.getItem('toBuyProductsInList' + listId));
			const customProduct = JSON.parse(localStorage.getItem('customItemsUser' + userId));

			const customProductIndex = customProduct.findIndex((p) => p.uniqueKey === productToEdit.uniqueKey);
			const productIndex = allProductsList.findIndex((p) => p.uniqueKey === productToEdit.uniqueKey);
			const productIndexToBuy = toBuyList.findIndex((p) => p.uniqueKey === productToEdit.uniqueKey);

			if (productIndexToBuy !== -1) {
				// Clone the existing product to avoid mutating the original array
				const updatedProduct = { ...toBuyList[productIndexToBuy] };

				// Update specific details with the form data
				updatedProduct.name['en'] = formData.nameEN || updatedProduct.nameEN;
				updatedProduct.name['mt'] = formData.nameMT || updatedProduct.nameMT;
				updatedProduct.category['en'] = formData.categoryEN || updatedProduct.categoryEN;
				updatedProduct.category['mt'] = formData.categoryMT || updatedProduct.categoryMT;
				updatedProduct.quantity = formData.quantity || updatedProduct.quantity;
				updatedProduct.unit = formData.unit || updatedProduct.unit;
				updatedProduct.price = formData.price || updatedProduct.price;
				// Update the product in the allProductsList array
				toBuyList[productIndexToBuy] = updatedProduct;
				// Save the updated allProductsList back to localStorage
				localStorage.setItem('toBuyProductsInList' + listId, JSON.stringify(toBuyList));
			}

			if (productIndex !== -1) {
				// Clone the existing product to avoid mutating the original array
				const updatedProduct = { ...allProductsList[productIndex] };

				// Update specific details with the form data
				updatedProduct.name['en'] = formData.nameEN || updatedProduct.nameEN;
				updatedProduct.name['mt'] = formData.nameMT || updatedProduct.nameMT;
				updatedProduct.category['en'] = formData.categoryEN || updatedProduct.categoryEN;
				updatedProduct.category['mt'] = formData.categoryMT || updatedProduct.categoryMT;
				updatedProduct.quantity = formData.quantity || updatedProduct.quantity;
				updatedProduct.unit = formData.unit || updatedProduct.unit;
				updatedProduct.price = formData.price || updatedProduct.price;

				// Update the product in the allProductsList array
				allProductsList[productIndex] = updatedProduct;

				// Save the updated allProductsList back to localStorage
				localStorage.setItem('allProductsInList' + listId, JSON.stringify(allProductsList));
			}

			if (customProductIndex !== -1) {
				// Clone the existing product to avoid mutating the original array
				const updatedProduct = { ...customProduct[customProductIndex] };

				// Update specific details with the form data
				updatedProduct.name['en'] = formData.nameEN || updatedProduct.nameEN;
				updatedProduct.name['mt'] = formData.nameMT || updatedProduct.nameMT;
				updatedProduct.category['en'] = formData.categoryEN || updatedProduct.categoryEN;
				updatedProduct.category['mt'] = formData.categoryMT || updatedProduct.categoryMT;
				updatedProduct.quantity = formData.quantity || updatedProduct.quantity;
				updatedProduct.unit = formData.unit || updatedProduct.unit;
				updatedProduct.price = formData.price || updatedProduct.price;

				// Update the product in the allProductsList array
				customProduct[customProductIndex] = updatedProduct;

				// Save the updated allProductsList back to localStorage
				localStorage.setItem('customItemsUser' + userId, JSON.stringify(customProduct));
			}
			setOpenEditProduct((prev) => !prev);
			updateList();
			if (product.custom) {
				axiosClient
					.put(`/update-custom-product/${product.uniqueKey}/${userId}`, formData)
					.then((res) => {
						getMyProducts();
					})
					.catch((err) => {});
			} else {
				console.log(formData);
				axiosClient
					.put(`/update-product/${listId}/${product.uniqueKey}`, formData)
					.then((res) => {
						console.log(res);
					})
					.catch((err) => {
						console.log(err);
					});
			}
		}
	};
	console.log(formData);
	return (
		<Container key={product.uniqueKey} className="product-edit" style={{ backgroundColor: darkMode ? 'white' : 'black' }}>
			<ContentContainer style={{ backgroundColor: darkMode ? 'black' : 'white' }}>
				<span onClick={handleClose}>
					<FontAwesomeIcon icon={faXmark} />
				</span>
				<form onSubmit={handleSubmit}>
					<h1>{translate('edit-product-header')}</h1>
					<h1>{product.name[language]}</h1>
					<h2>{translate('name-grp')}</h2>
					<div className="grp">
						<div className="input-grp">
							<label>{translate('english')}</label>
							<input
								type="text"
								name="nameEN"
								value={formData.nameEN || ''}
								onChange={handleChange}
								pattern="[^\d]+"
								onInvalid={(e) => e.target.setCustomValidity(translate('input-only-text'))}
								onInput={(e) => e.target.setCustomValidity('')} // Reset the validity on valid input
							/>
						</div>
						<div className="input-grp">
							<label>{translate('maltese')}</label>
							<input
								type="text"
								name="nameMT"
								onInvalid={(e) => e.target.setCustomValidity(translate('input-only-text'))}
								onInput={(e) => e.target.setCustomValidity('')}
								value={formData.nameMT || ''}
								onChange={handleChange}
								pattern="[^\d]+"
							/>
						</div>
					</div>
					<h2>{translate('category-grp')}</h2>
					<div className="grp">
						<div className="input-grp">
							<label>{translate('english')}</label>
							<input
								type="text"
								onInvalid={(e) => e.target.setCustomValidity(translate('input-only-text'))}
								onInput={(e) => e.target.setCustomValidity('')}
								name="categoryEN"
								pattern="[^\d]+"
								value={formData.categoryEN || ''}
								onChange={handleChange}
							/>
						</div>
						<div className="input-grp">
							<label>{translate('maltese')}</label>
							<input
								type="text"
								onInvalid={(e) => e.target.setCustomValidity(translate('input-only-text'))}
								onInput={(e) => e.target.setCustomValidity('')}
								name="categoryMT"
								pattern="[^\d]+"
								value={formData.categoryMT || ''}
								onChange={handleChange}
							/>
						</div>
					</div>
					<h2>{translate('unit&quantity-grp')}</h2>
					<div className="grp">
						<div className="input-grp">
							<input name="quantity" type="number" value={formData.quantity || ''} onChange={handleChange} />
						</div>
						<div className="input-grp">
							<select name="unit" value={formData.unit || ''} onChange={handleChange}>
								<option value="KG">KG</option>
								<option value="Grams">{translate('Grams')}</option>
								<option value="L">L</option>
								<option value="ML">ML</option>
								<option value="Pc">Pc{formData.quantity > 1 && 's'}</option>
								<option value="Pack">{translate('Pack')}</option>
							</select>
						</div>
					</div>
					<h2>
						{translate('price-grp')}
						{formData.unit}
						{formData.quantity > 1 && 's'}
					</h2>
					<div className="grp">
						<div className="input-grp">
							<input name="price" type="number" value={formData.price || ''} onChange={handleChange} />
						</div>
					</div>
					<div className="grp">
						<button onClick={handleClose} className="btn cancle">
							{translate('cancel-btn')}
						</button>
						<button className="btn save">{translate('save')}</button>
					</div>
				</form>
			</ContentContainer>
		</Container>
	);
};

export default ProductEditOverlay;
