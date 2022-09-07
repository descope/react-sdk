import React, { useState, useCallback } from 'react';
import { Descope, useAuth } from '../lib';

const getUserDisplayName = (user) =>
	user?.displayName || user?.externalIDs?.[0].id || '';

const App = () => {
	const [showFlow, setShowFlow] = useState(false);
	const { authenticated, user } = useAuth();
	const onSuccess = useCallback(
		(res) => {
			// eslint-disable-next-line no-console
			console.log(res);
			setShowFlow(false);
		},
		[setShowFlow]
	);

	const onError = useCallback(
		(res) => {
			// eslint-disable-next-line no-console
			console.log(res);
			setShowFlow(false);
		},
		[setShowFlow]
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
				{showFlow && (
					<Descope flowId="otp.json" onSuccess={onSuccess} onError={onError} />
				)}
				{!showFlow && (
					<button
						type="button"
						onClick={() => setShowFlow(true)}
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