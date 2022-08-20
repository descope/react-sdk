import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRoot } from 'react-dom/client';
import Descope from '../lib/Descope';

const App = () => {
	const [flowId, setFlowId] = useState('login1');

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
				<Descope
					// eslint-disable-next-line no-console
					onError={console.log}
					// eslint-disable-next-line no-console
					onSuccess={console.log}
					projectId="P2D7Y6k9RmeA28cSWODM2DS51xCj"
					flowId="otp.json"
					baseUrl="http://localhost:8000"
				/>

				<button
					type="button"
					onClick={() =>
						setFlowId((id) => (id === 'login1' ? 'signup1' : 'login1'))
					}
					style={{
						display: 'block',
						margin: 'auto',
						background: 'none',
						border: 'none',
						color: 'blue',
						padding: 5
					}}
				>
					{flowId === 'login1'
						? "Don't have an account?"
						: 'Already have an account'}
				</button>
			</div>
		</div>
	);
};

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<App />);
