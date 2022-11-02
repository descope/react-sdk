import React, { FC, useCallback, useState } from 'react';
import { Descope, useAuth } from '../lib';

const getUserDisplayName = (user) => user?.name || user?.externalIds?.[0] || '';

const App: FC<{ flowId: string }> = ({ flowId }) => {
	const { authenticated, user, logout } = useAuth();

	const [showFlow, setShowFlow] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const onStart = useCallback(() => {
		setShowFlow(true);
		setErrorMessage('');
	}, [setShowFlow, setErrorMessage]);

	const onSuccess = useCallback(() => {
		setShowFlow(false);
	}, [setShowFlow, setErrorMessage]);

	const onError = useCallback(() => {
		setShowFlow(false);
		setErrorMessage('Something went wrong');
	}, [setShowFlow, setErrorMessage]);

	const onLogout = useCallback(() => {
		logout();
	}, [logout]);

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
				{authenticated && (
					<div className="username"> Hello {getUserDisplayName(user)}</div>
				)}
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
					<Descope flowId={flowId} onSuccess={onSuccess} onError={onError} />
				)}
				{!showFlow && !authenticated && (
					<button
						type="button"
						className="start-button"
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
				{authenticated && (
					<button
						type="button"
						className="logout-button"
						onClick={onLogout}
						style={{
							display: 'block',
							margin: 'auto',
							background: 'none',
							border: 'none',
							color: 'blue',
							padding: 5
						}}
					>
						Logout
					</button>
				)}
			</div>
		</div>
	);
};

export default App;
