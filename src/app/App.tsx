import React, { useState, useCallback } from 'react';
import { Descope, useAuth } from '../../dist';

const getUserDisplayName = (user) =>
	user?.name || user?.externalIds?.[0].id || '';

const App = () => {
	const { authenticated, user } = useAuth();

	const [showFlow, setShowFlow] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	
	const onStart = useCallback(() => {
		setShowFlow(true);
		setErrorMessage('');
	}, [setShowFlow, setErrorMessage]);

	const onSuccess = useCallback(
		(res) => {
			// eslint-disable-next-line no-console
			console.log(res);
			setShowFlow(false);
		},
		[setShowFlow, setErrorMessage]
	);

	const onError = useCallback(
		(res) => {
			// eslint-disable-next-line no-console
			console.log(res);
			setShowFlow(false);
			setErrorMessage('Something went Wrong');
		},
		[setShowFlow, setErrorMessage]
	);

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
				{authenticated && <div> Hello {getUserDisplayName(user)}</div>}
				{errorMessage && (
					<div
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
						flowId="<flow-id>"
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
