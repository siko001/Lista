import React from 'react';
import styled from 'styled-components';
import { useDarkMode } from '../contexts/DarkModeContext';

const SettingContainer = styled.div`
	p {
		font-family: Arial, Helvetica, sans-serif;
		font-weight: bold;
		color: #fff;
	}

	.toggle {
		position: relative;
		display: inline-block;
		min-width: 100px;
		max-width: 100px;
		height: 52px;
		background-color: red;
		border-radius: 30px;
	}
	.toggle {
		display: flex;
		justify-content: space-between;
		padding: 17px 10px;
	}

	.toggle:after {
		content: '';
		position: absolute;
		width: 45px;
		height: 45px;
		border-radius: 50%;
		background-color: transparent;
		border: 2px solid black;
		top: 1px;
		left: 3px;
		transition: all 0.5s;
	}

	.checkbox:checked + .toggle::after {
		left: 49px;
	}

	.checkbox:checked + .toggle {
		background-color: green;
	}

	.checkbox {
		display: none;
	}

	.setting-group {
		display: flex;
		align-items: center;
		gap: 5px;
	}
`;

const Setting = ({ setDarkMode }) => {
	const handleSetDarkMode = () => {
		setDarkMode((prev) => !prev);
	};
	return (
		<SettingContainer>
			<div className="setting-group">
				Dark Mode
				<input type="checkbox" id="switch" class="checkbox" onClick={handleSetDarkMode} />
				<label for="switch" class="toggle">
					<p>OFF</p>
					<p>ON</p>
				</label>
			</div>
		</SettingContainer>
	);
};

export default Setting;
