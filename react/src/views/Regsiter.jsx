import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useUser } from '../contexts/UserContext';
import Loader from '../components/loaders/GetListLoader';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Container = styled.div`
	height: 100vh;
	width: 100vw;
	display: grid;
	place-items: center;
`;

const RegisterBox = styled.div`
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
			margin: 0 auto;
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
	.disbled {
		opacity: 0.6;
	}
	.valid-b {
		border: 2px solid green;
	}
	.not-valid-b {
		border-color: red;
	}
	.not-valid-h {
		color: red;
	}
	.not-valid-o {
		outline-color: red;
	}
`;

const Register = () => {
	const { user, setUser, token, setToken, login } = useUser();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState([]);
	const [formIsValid, setFormIsValid] = useState(false);
	const { translate } = useLanguage();

	const [nameMessage, setNameMessage] = useState('');
	const [nameIsValid, setNameIsValid] = useState(null);

	const [emailIsValid, setEmailIsValid] = useState(null);
	const [emailMessage, setEmailMessage] = useState('');

	const [passwordIsValid, setPasswordIsValid] = useState(null);
	const [passwordMessage, setPasswordMessage] = useState('');

	const [confirmPasswordMessage, setConfirmPasswordMessage] = useState();
	const [confirmPasswordValid, setConfirmPasswordValid] = useState(null);

	const [mainMessage, setMainMessage] = useState();

	const navigate = useNavigate();

	const usernameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();
	const checkTheForm = () => {
		if (confirmPasswordValid === true && passwordIsValid === true && emailIsValid === true && nameIsValid === true) {
			setFormIsValid(true);
		} else {
			setFormIsValid(false);
		}
	};

	const handleRegister = (e) => {
		setLoading(true);
		e.preventDefault();
		const userId = localStorage.getItem('ACCESS_TOKEN');
		const data = {
			name: usernameRef.current.value,
			email: emailRef.current.value,
			password: passwordRef.current.value,
			passwordConfirmation: confirmPasswordRef.current.value,
		};
		if (data) {
			axiosClient
				.put('/register-user/' + userId, data)
				.then((res) => {
					setUser(res.data[0]);
					setMainMessage(res.data.message);
				})
				.catch((err) => {
					if (err.response.status === 422) {
						const message = <p className="red boldest">{err.response.data.message}</p>;
						setMainMessage(message);
						return setTimout(() => {
							navigate('/');
						}, 1000);
					}
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			const message = <p className="red">{translate('All fields are required')}</p>;
			setMainMessage(message);
		}
	};

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

	//Check The Username Validity
	const checkUserNameValidity = debounce(() => {
		setNameIsValid(false);

		const message = <p className="red">{translate('Username must container atleast 4 characters')}</p>;
		setNameMessage(message);
		if (usernameRef.current.value.length > 3) {
			setNameIsValid(true);
			setNameMessage('');
			checkTheForm();
		}
		if (usernameRef.current.value.length == 0) {
			setNameIsValid(false);
			const message = <p className="red">{translate('Username is required')}</p>;
			setNameMessage(message);
			checkTheForm();
		}
	}, 500);

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
			const message = <p className="red">{translate('Please enter a valid email')}</p>;
			setEmailMessage(message);
			checkTheForm();
			return setEmailIsValid(false);
		} else {
			try {
				const availability = await checkEmailAvaliability(emailRef.current.value);
				const { message } = availability.data;

				if (message == 'Email Is Taken') {
					setEmailIsValid(false);
					const taggedMessage = (
						<p className="red">
							<strong>{translate('Email Is Taken')}</strong>
						</p>
					);
					setEmailMessage(taggedMessage);
				} else {
					setEmailIsValid(true);

					const { message } = availability.data;
					const taggedMessage = (
						<p className="green">
							<strong>{translate('Email Available')}</strong>
						</p>
					);
					setEmailMessage(taggedMessage);
					checkTheForm();
				}
			} catch (error) {
				console.error(error);
			}
		}
	}, 300);

	const checkPasswordValidity = debounce(() => {
		const password = passwordRef.current.value;
		const passwordConfirmation = confirmPasswordRef.current.value;
		if (password.length < 6) {
			const message = <p className="red">{translate('Password must be atleast 6 characters long')}</p>;
			setPasswordIsValid(false);
			setPasswordMessage(message);
			checkTheForm();
		} else {
			setPasswordIsValid(true);
			setPasswordMessage('');
			checkTheForm();
		}

		if (password && passwordConfirmation) {
			if (password !== passwordConfirmation) {
				const message = <p className="red">{translate('Passwords do not match')}</p>;
				setPasswordIsValid(false);
				setPasswordMessage(message);
				checkTheForm();
			} else if (password.length < 6) {
				const message = <p className="red">{translate('Password must be atleast 6 characters long')}</p>;
				setPasswordIsValid(false);
				setPasswordMessage(message);
				checkTheForm();
			} else {
				checkTheForm();
				setPasswordIsValid(true);
				setPasswordMessage('');
				checkTheForm();
			}
		}
	}, 200);

	const handleBlur = () => {
		checkTheForm();
	};

	const confirmPassword = debounce(() => {
		const password = passwordRef.current.value;
		const passwordConfirmation = confirmPasswordRef.current.value;
		if (passwordConfirmation.length < 6) {
			setConfirmPasswordValid(false);
			checkTheForm();
		} else {
			setConfirmPasswordValid(true);
			checkTheForm();
		}
		if (password && passwordConfirmation) {
			if (password !== passwordConfirmation) {
				const message = <p className="red">{translate('Passwords do not match')}</p>;
				setConfirmPasswordValid(false);
				setConfirmPasswordMessage(message);
			} else if (passwordConfirmation.length < 6) {
				setConfirmPasswordValid(false);
				checkTheForm();
			} else {
				setConfirmPasswordValid(true);
				setConfirmPasswordMessage('');
				checkTheForm();
			}
		}
	}, 200);
	return (
		<Container onMouseMove={handleBlur} onTouchMove={handleBlur}>
			<RegisterBox>
				<form onSubmit={handleRegister}>
					<h1>
						<Link className="header" to="/">
							Lista
						</Link>
					</h1>
					<h2>{translate('Register')}</h2>
					{/* username */}
					<div className="grp">
						<label className={nameIsValid || nameIsValid === null ? 'valid-h' : 'not-valid-h'}>{translate('username')}</label>
						<span className="small">{nameMessage}</span>
						<input
							className={nameIsValid || nameIsValid === null ? 'valid-b' : 'not-valid-b'}
							style={{ outlineColor: nameIsValid ? '' : 'red' }}
							onChange={() => {
								checkUserNameValidity();
								handleBlur();
							}}
							onBlur={() => {
								checkUserNameValidity();
								handleBlur();
							}}
							ref={usernameRef}
							minLength={4}
							placeholder={translate('Enter your username')}
						/>
					</div>

					{/* Email */}
					<div className="grp">
						<label className={emailIsValid || emailIsValid === null ? '' : 'not-valid-h'}>{translate('Email')}</label>
						<span className="small"> {emailMessage}</span>
						<input
							className={emailIsValid || emailIsValid === null ? 'valid-b' : 'not-valid-b'}
							style={{ outlineColor: emailIsValid || emailIsValid === null ? '' : 'red' }}
							onChange={() => {
								checkEmailValidity();
								handleBlur();
							}}
							onBlur={() => {
								checkEmailValidity();
								handleBlur();
							}}
							ref={emailRef}
							type="email"
							placeholder={translate('Enter a valid email')}
						/>
					</div>

					{/* Password */}
					<div className="grp">
						<label className={passwordIsValid || passwordIsValid == null ? '' : 'not-valid-h'}>Password</label>
						{passwordMessage}
						<input
							onChange={() => {
								checkPasswordValidity();
								confirmPassword();
								handleBlur();
							}}
							onBlur={() => {
								checkPasswordValidity();
								confirmPassword();
								handleBlur();
							}}
							className={
								passwordIsValid || (passwordIsValid == null && confirmPassword) || confirmPassword == null
									? 'valid-b'
									: 'not-valid-b'
							}
							style={{
								outlineColor:
									passwordIsValid || (passwordIsValid == null && confirmPassword) || confirmPassword == null ? '' : 'red',
							}}
							ref={passwordRef}
							type="password"
							placeholder={translate('Minimum 6 characters long')}
						/>
					</div>

					{/*Confirm  Password */}
					<div className="grp">
						<label
							className={
								passwordIsValid || (passwordIsValid == null && confirmPassword) || confirmPassword == null
									? ''
									: 'not-valid-h'
							}
						>
							{translate('Password Confirmation')}
						</label>
						{confirmPasswordMessage}
						<input
							onChange={() => {
								checkPasswordValidity();
								confirmPassword();
								handleBlur();
							}}
							onBlur={() => {
								checkPasswordValidity();
								confirmPassword();
								handleBlur();
							}}
							className={
								passwordIsValid || (passwordIsValid == null && confirmPassword) || confirmPassword == null
									? 'valid-b'
									: 'not-valid-b'
							}
							style={{
								outlineColor:
									passwordIsValid || (passwordIsValid == null && confirmPassword) || confirmPassword == null ? '' : 'red',
							}}
							ref={confirmPasswordRef}
							type="password"
							placeholder="Confirm Your Password"
						/>
					</div>
					<div className="grp-bottom">
						{mainMessage}
						{errors.length !== 0 && errors}
						<p>
							{translate('Already have an account?')}
							<span> </span>
							<Link className="linkTo" to="/login">
								{translate('Login here')}
							</Link>
						</p>
						<button disabled={!formIsValid} className={!formIsValid ? 'disbled btn' : 'btn'}>
							{translate('Register')}
						</button>
					</div>
				</form>
				{loading && <Loader />}
			</RegisterBox>
		</Container>
	);
};

export default Register;
