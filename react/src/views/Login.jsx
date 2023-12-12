import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useLanguage } from '../contexts/LanguageContext';

const Container = styled.div`
	height: 100vh;
	width: 100vw;
	display: grid;
	place-items: center;
`;

const LoginBox = styled.div`
	height: 550px;
	width: 400px;
	border: 3px solid rgba(0, 0, 0, 0.3);
	@media screen and (max-width: 750px) {
		width: 95%;
		height: 95%;
	}

	form {
		align-items: center;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		justify-content: space-evenly;
		h1 {
			font-size: 3.5rem;
			color: #0202c4;
		}
		h2 {
			opacity: 0.8;
		}

		input {
			border: 1px solid;
			height: 30px;
			width: 300px;
			padding-left: 10px;
		}

		.grp {
			display: flex;
			flex-direction: column;
			gap: 5px;
		}
		.grp-bottom {
			display: flex;
			flex-direction: column;
			gap: 15px;
			text-align: center;
		}
		button {
			margin: 10px auto;
			width: 200px;
			background-color: #0202c4;
			color: white;
			font-size: 1rem;
			font-weight: 600;
		}

		.header:visited {
			color: #0202c4;
		}

		.linkTo {
			color: green;
		}
	}
`;

const Login = () => {
	const [emailValid, setEmailValid] = useState(null);
	const [emailMessage, setEmailMessage] = useState();

	const [passwordValid, setPasswordValid] = useState(null);
	const [passwordMessage, setPasswordMessage] = useState();

	const [formValid, setFormValid] = useState(false);
	const [message, setMessage] = useState(null);

	const { setUser } = useUser();
	const navigate = useNavigate();
	const { translate } = useLanguage();

	const emailRef = useRef();
	const passwordRef = useRef();

	// timer and resetter
	const debounce = (func, delay) => {
		let timerId;
		return (...args) => {
			clearTimeout(timerId);
			timerId = setTimeout(() => {
				func(...args);
			}, delay);
		};
	};

	const checkFormValidity = () => {
		if (emailValid === true && passwordValid === true) {
			setFormValid(true);
		} else {
			setFormValid(false);
		}
	};

	//Email
	//Check if the email is avaliable
	const checkEmailAvaliability = async (email) => {
		try {
			const response = await axiosClient.post('/check-email', { email });
			return response;
		} catch (error) {}
	};

	//Check if the email is valid function
	const checkEmailValidity = debounce(async () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(emailRef.current.value)) {
			const message = <p className="red">Please enter a valid email</p>;
			setEmailMessage(message);
			checkFormValidity();
			return setEmailValid(false);
		} else {
			setEmailMessage('');
			try {
				const availability = await checkEmailAvaliability(emailRef.current.value);
				const { message } = availability.data;
				if (message == 'Email Is Taken') {
					setEmailValid(true);
					checkFormValidity();
				} else {
					setEmailValid(false);
					checkFormValidity();
				}
			} catch (error) {
				console.error(error);
			}
		}
	}, 300);

	const checkPasswordValidity = debounce(() => {
		if (passwordRef.current.value.length < 6) {
			const message = <p className="red">{translate('Password must be atleast 6 characters long')}</p>;
			setPasswordMessage(message);
			setPasswordValid(false);
			checkFormValidity();
		} else {
			setPasswordMessage('');
			setPasswordValid(true);
			checkFormValidity();
		}
	}, 500);

	const handleLogin = (e) => {
		e.preventDefault();
		const data = {
			email: emailRef.current.value,
			password: passwordRef.current.value,
		};

		if (!data) {
			const message = <p className="red">{translate('Please enter all crudentials')}</p>;
			setMessage(message);
		}
		if (data) {
			axiosClient
				.post('/login-user', data)
				.then((res) => {
					localStorage.removeItem('ACCESS_TOKEN');
					localStorage.setItem('ACCESS_TOKEN', res.data.user.id);
					localStorage.setItem('login', 'true');
					setUser(res.data.user);
					navigate('/');
				})
				.catch((err) => {
				
				});
		}
	};

	return (
		<Container onMouseMove={checkFormValidity}>
			<LoginBox>
				<form onSubmit={handleLogin}>
					<h1>
						<Link className="header" to="/">
							Lista
						</Link>
					</h1>
					<h2>Login</h2>

					<div className="grp">
						<label className={emailValid || emailValid === null ? (emailValid === true ? 'green' : '') : 'red'}>
							{translate('Email')}
						</label>
						{emailMessage && emailMessage}
						<input
							onChange={checkEmailValidity}
							style={{
								border: emailValid || emailValid === null ? (emailValid === true ? '2px solid green' : '') : '2px solid red',
								outlineColor: emailValid || emailValid === null ? (emailValid === true ? 'green' : '') : 'red',
							}}
							ref={emailRef}
							placeholder={translate('Enter your email')}
						/>
					</div>
					<div className="grp">
						<label className={passwordValid || passwordValid === null ? (passwordValid === true ? 'green' : '') : 'red'}>
							Password
						</label>
						{passwordMessage && passwordMessage}
						<input
							onChange={checkPasswordValidity}
							onKeyDown={
								(setTimeout(() => {
									checkFormValidity();
								}),
								300)
							}
							style={{
								border:
									passwordValid || passwordValid === null
										? passwordValid === true
											? '2px solid green'
											: ''
										: '2px solid red',
								outlineColor: passwordValid || passwordValid === null ? (passwordValid === true ? 'green' : '') : 'red',
							}}
							ref={passwordRef}
							placeholder={translate('Enter your password')}
							type="password"
						/>
					</div>

					<div className="grp-bottom">
						{message && message}
						<p>
							{translate("Don't have an account?")}
							<Link className="linkTo" to="/register">
								{translate('Create one here')}
							</Link>
						</p>
						<Link to="/password-reset">
							<p>{translate('Forgot password')}</p>
						</Link>

						<button disabled={!formValid} style={{ opacity: !formValid ? '0.5' : '1' }} className="btn">
							{translate('Login')}
						</button>
					</div>
				</form>
			</LoginBox>
		</Container>
	);
};

export default Login;
