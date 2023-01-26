import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Descope } from '../lib';
import { DescopeTheme } from '../lib/types';

const Login = () => {
	const [errorMessage, setErrorMessage] = useState('');

	const navigate = useNavigate();
	const onSuccess = useCallback(() => {
		navigate('/');
	}, [navigate]);

	const onError = useCallback(() => {
		setErrorMessage('Something went wrong');
	}, [setErrorMessage]);
	return (
		<>
			<Descope
				flowId={process.env.DESCOPE_FLOW_ID || 'sign-up-or-in'}
				onSuccess={onSuccess}
				onError={onError}
				debug={process.env.DESCOPE_DEBUG_MODE === 'true'}
				theme={process.env.DESCOPE_THEME as DescopeTheme}
				telemetryKey={process.env.DESCOPE_TELEMETRY_KEY || undefined}
			/>
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
		</>
	);
};

export default Login;
