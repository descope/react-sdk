import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Descope, useSession } from '../../src';

const Login = () => {
	const [errorMessage, setErrorMessage] = useState('');

	const { isAuthenticated, isSessionLoading } = useSession();

	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/');
		}
	}, [navigate, isAuthenticated]);

	const onSuccess = useCallback(() => {
		navigate('/');
	}, [navigate]);

	console.log('@@@ login', { isAuthenticated, isSessionLoading }); // eslint-disable-line no-console

	const onError = useCallback(() => {
		setErrorMessage('Something went wrong');
	}, [setErrorMessage]);

	if (isSessionLoading) return <div>Loading...</div>;
	return (
		<>
			<Descope
				flowId={process.env.DESCOPE_FLOW_ID || 'sign-up-or-in'}
				onSuccess={onSuccess}
				onError={onError}
				debug={process.env.DESCOPE_DEBUG_MODE === 'true'}
				theme={process.env.DESCOPE_THEME as any}
				redirectUrl={process.env.DESCOPE_REDIRECT_URL}
				tenant={process.env.DESCOPE_TENANT_ID}
				telemetryKey={process.env.DESCOPE_TELEMETRY_KEY}
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
