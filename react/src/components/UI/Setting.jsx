import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { Link } from 'react-router-dom';
import { useTour } from '@reactour/tour';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const SettingContainer = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 10px;
	padding: 10px;
	@media screen and (max-width: 650px) {
		flex-direction: column-reverse;
	}

	.half-setting {
		gap: 10px;
		display: flex;
		flex-direction: column;
	}
	.right-group {
		align-items: center;
		@media screen and (max-width: 650px) {
			flex-direction: column-reverse;
			align-items: flex-start;
		}
	}
	.link {
		font-size: 1.4rem;
	}
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
		&:hover {
			cursor: pointer;
		}
	}

	.tutorial-btn {
		font-weight: 600;
		font-size: 0.8rem;
		color: white;
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
		&:hover {
			cursor: pointer;
		}
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
	.myLink {
		color: inherit;
		&:hover {
			opacity: 0.5;
		}
	}

	.user {
		font-weight: 600;
		margin: 10px 0;
	}
	.logout-btn {
		background-color: red;
		color: white;
		font-weight: 600;
		font-size: 0.9rem;
	}
`;

const Setting = ({ onChangeDarkMode, steps }) => {
	const { translate, changeLanguage } = useLanguage();
	const { darkMode, setDarkMode } = useDarkMode();
	const lang = useLanguage().language;
	const isDarkMode = useDarkMode().darkMode;
	const { setIsOpen } = useTour();
	const { user, setUser } = useUser();
	const navigate = useNavigate();

	const handleSetLang = () => {
		changeLanguage((language) => (language === 'en' ? 'mt' : 'en'));
	};

	const handleSetDarkMode = () => {
		const updatedDarkMode = !darkMode;
		setDarkMode(updatedDarkMode);
	};

	useEffect(() => {
		localStorage.setItem('theme', darkMode);
	}, [darkMode, user]);

	const handleLogout = () => {
		localStorage.removeItem('ACCESS_TOKEN');
		localStorage.removeItem('shoppingLists');
		localStorage.setItem('shoppingLists', '[]');
		setUser({
			name: null,
			email: null,
			is_guest: 'true',
		});
		navigate('/logout');
	};

	return (
		<SettingContainer>
			<div className="half-setting">
				<div className="setting-group">
					<div className="setting-title">{translate('languague')}</div>

					<input type="checkbox" id="langswitch" className="checkbox " onChange={handleSetLang} checked={lang === 'mt'} />
					<label htmlFor="langswitch" className="toggle-lang second-step">
						<p>En</p>
						<p>Mt</p>
					</label>
				</div>
				<div className="setting-group ">
					<div className="setting-title ">{translate('darkMode')}</div>
					<input type="checkbox" id="switch" className="checkbox" onChange={handleSetDarkMode} checked={isDarkMode} />
					<label htmlFor="switch" className="toggle  third-step">
						<p>{translate('off')}</p>
						<p>{translate('on')}</p>
					</label>
				</div>
				<p style={{ color: darkMode ? 'white' : 'black' }}>
					Verion 1.0 || Developer :
					<a className="myLink" href="https://neilmallia.com" target="_blank">
						Neil Mallia
					</a>
				</p>
			</div>
			<div className="half-setting right-group fifth-step">
				<button
					className="btn tutorial-btn forth-step"
					style={{ backgroundColor: 'green', fontWeight: 600 }}
					onClick={() => setIsOpen(true)}
				>
					{translate('tutorial-play')}
				</button>
				{user && user.is_guest === 'true' ? (
					<React.Fragment>
						<Link to="/register" className="link">
							{translate('register')}
						</Link>
						<Link to="/login" className="link">
							{translate('login')}
						</Link>
					</React.Fragment>
				) : (
					user && (
						<React.Fragment>
							<h3 className="user">Welcome {user.name}</h3>
							<button onClick={handleLogout} className="btn logout-btn">
								Logout
							</button>
						</React.Fragment>
					)
				)}
			</div>
		</SettingContainer>
	);
};

export default Setting;
