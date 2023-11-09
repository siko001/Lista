import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 25px;
	position: fixed;
	bottom: 50px;
	min-width: 200px;
	max-width: 350px;
	text-align: center;
	min-height: 100px;
	z-index: 2;
	color: rgba(0, 0, 0, 0.73);
	font-weight: 600;
	padding: 20px 30px;
	animation: ${slideIn} 0.5s ease forwards;
	background-color: ${(props) => (props.status === 200 ? '#00db00' : props.status === 400 ? 'red' : '#00db00')};
`;

const Notification = ({ message, status }) => {
	const [showNotification, setShowNotification] = useState(false);

	useEffect(() => {
		if (message) {
			setShowNotification(true);
			const notificationTimer = setTimeout(() => {
				setShowNotification(false);
			}, 1500);
			return () => clearTimeout(notificationTimer);
		}
	}, [message]);

	return showNotification && <Container status={status}>{message}</Container>;
};

export default Notification;
