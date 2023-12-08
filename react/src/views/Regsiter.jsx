import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
`;

const Register = () => {
	return (
		<Container>
			<RegisterBox>
				<form>
					<h1>
						<Link className="header" to="/">
							Lista
						</Link>
					</h1>
					<h2>Register</h2>
					<div className="grp">
						<label>Name</label>
						<input placeholder="name" />
					</div>
					<div className="grp">
						<label>Email</label>
						<input placeholder="Email" />
					</div>
					<div className="grp">
						<label>Password</label>
						<input placeholder="Password" />
					</div>
					<div className="grp">
						<label>Password Confirmation</label>
						<input placeholder="Password Confirmation" />
					</div>
					<div className="grp">
						<p>
							Already Have an Account?{' '}
							<Link className="linkTo" to="/login">
								Login here
							</Link>
						</p>
						<button className="btn">Register</button>
					</div>
				</form>
			</RegisterBox>
		</Container>
	);
};

export default Register;
