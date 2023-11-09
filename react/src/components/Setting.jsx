import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import { useDarkMode } from '../contexts/DarkModeContext';

const SettingContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 10px;
	p {
		font-family: Arial, Helvetica, sans-serif;
		font-weight: bold;
		color: #fff;
	}

	.toggle {
		position: relative;
		min-width: 101px;
		max-width: 101px;
		height: 50px;
		background-color: red;
		border-radius: 30px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex: 1;
		padding: 17px 0;
	}
	.toggle-lang {
		position: relative;
		min-width: 101px;
		max-width: 101px;
		height: 50px;
		background-color: black;
		border-radius: 30px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex: 1;
		padding: 17px 0;
	}

	.toggle:after,
	.toggle-lang:after {
		content: '';
		position: absolute;
		width: 45px;
		height: 45px;
		border-radius: 50%;
		background-color: transparent;
		border: 2px solid rgba(255, 255, 255, 0.7);
		top: 1px;
		left: 3px;
		transition: all 0.5s;
	}

	.checkbox:checked + .toggle::after {
		left: 50px;
	}

	.checkbox:checked + .toggle-lang::after {
		left: 50px;
	}

	.checkbox:checked + .toggle {
		background-color: green;
	}
	.checkbox:checked + .toggle-lang {
		background-color: black;
	}

	.checkbox {
		display: none;
	}

	.setting-group {
		width: 40%;
		display: flex;
		align-items: center;

		label {
		}

		.setting-title {
			min-width: 100px;
		}
	}
`;

const Setting = ({ onChangeDarkMode }) => {
	const { translate, changeLanguage } = useLanguage();
	const { darkMode, setDarkMode } = useDarkMode();

	const handleSetLang = () => {
		changeLanguage((language) => (language === 'en' ? 'mt' : 'en'));
	};

	const handleSetDarkMode = () => {
		const updatedDarkMode = !darkMode;
		setDarkMode((prev) => !prev);
		onChangeDarkMode(updatedDarkMode);
	};

	useEffect(() => {
		localStorage.setItem('theme', darkMode);
	}, [darkMode]);

	return (
		<SettingContainer>
			<div className="setting-group">
				<div className="setting-title">{translate('languague')}</div>

				<input
					type="checkbox"
					id="langswitch"
					className="checkbox"
					onClick={handleSetLang}
					checked={useLanguage().language === 'mt'}
				/>
				<label htmlFor="langswitch" className="toggle-lang">
					<p>En</p>
					<p>Mt</p>
				</label>
			</div>
			<div className="setting-group">
				<div className="setting-title">{translate('darkMode')}</div>
				<input type="checkbox" id="switch" className="checkbox" onClick={handleSetDarkMode} checked={useDarkMode().darkMode} />

				<label htmlFor="switch" class="toggle">
					<p>{translate('off')}</p>
					<p>{translate('on')}</p>
				</label>
			</div>
			Verion 1.0
		</SettingContainer>
	);
};

export default Setting;
