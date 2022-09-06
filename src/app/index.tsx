import React, { useState, useCallback } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRoot } from 'react-dom/client';
import AuthProvider from '../lib/components/AuthProvider';
import Descope from '../lib/components/Descope';

const App = () => {
	const [showFlow, setShowFlow] = useState(false);
	const [message, setMessage] = useState('');
	const onSuccess = useCallback(
		(res) => {
			// eslint-disable-next-line no-console
			console.log(res);
			setMessage('Flow Succeed');
			setShowFlow(false);
		},
		[setMessage, setShowFlow]
	);

	const onError = useCallback(
		(res) => {
			// eslint-disable-next-line no-console
			console.log(res);
			setMessage('Flow Failed');
			setShowFlow(false);
		},
		[setMessage, setShowFlow]
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
				{showFlow && (
					<Descope
						projectId="<your-project-id>"
						flowId="<flow-id>"
						onSuccess={onSuccess}
						onError={onError}
					/>
				)}
				{message && <div>{message}</div>}
				{!message && !showFlow && (
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

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<App />);
