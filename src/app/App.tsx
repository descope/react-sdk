import React, { FC, useState, useCallback, useEffect } from 'react';
import { Descope, useAuth } from '../lib';

const getUserDisplayName = (user) =>
	user?.name || user?.externalIds?.[0].id || '';

const SESSION_COOKIE_NAME = 'DS';

const isSessionCookieExists = () =>
	!!document.cookie && document.cookie.includes(`${SESSION_COOKIE_NAME}=`);

const setSessionCookie = (sessionToken) => {
	document.cookie = `${SESSION_COOKIE_NAME}=${sessionToken};`;
} 

const App:FC<{ flowId: string }> = ({ flowId }) => {
	const { authenticated, user, sessionToken } = useAuth();

	const [showFlow, setShowFlow] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	
	const onStart = useCallback(() => {
		setShowFlow(true);
		setErrorMessage('');
	}, [setShowFlow, setErrorMessage]);

	const onSuccess = useCallback(
		() => {
			setShowFlow(false);
		},
		[setShowFlow, setErrorMessage]
	);

	const onError = useCallback(
		() => {
			setShowFlow(false);
			setErrorMessage('Something went wrong');
		},
		[setShowFlow, setErrorMessage]
	);

	useEffect(() => {
		if (sessionToken && !isSessionCookieExists()) {
			setSessionCookie(sessionToken);
		}
	}, [sessionToken])

	return (
		<div style={{ height: '100vh', position: 'relative' }}>
			<div
				style={{
					borderRadius: 10,
					margin: 'auto',
					border: '1px solid lightgray',
					padding: 20,
					maxWidth: '400px',
					boxShadow: '13px 13px 20px #cbced1, -13px -13px 20px #fff',
					background: '#ecf0f3',
					position: 'relative',
					top: '50%',
					transform: 'translateY(-50%)'
				}}
			>
				{authenticated && <div className="username"> Hello {getUserDisplayName(user)}</div>}
				{errorMessage && (
					<div
						className="error"
						style={{
							margin: 'auto',
							color: 'red'
						}}
					>
						{errorMessage}
					</div>
				)}
				{showFlow && (
					<Descope
						flowId={flowId}
						onSuccess={onSuccess}
						onError={onError}
					/>
				)}
				{!showFlow && (
					<button
						type="button"
						onClick={onStart}
						style={{
							display: 'block',
							margin: 'auto',
							background: 'none',
							border: 'none',
							color: 'blue',
							padding: 5
						}}
					>
						Start Flow
					</button>
				)}
			</div>
		</div>
	);
};

export default App;
