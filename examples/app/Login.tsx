/* eslint-disable no-console */
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

	const onError = useCallback(() => {
		setErrorMessage('Something went wrong');
	}, [setErrorMessage]);

	const errorTransformer = useCallback(
		(error: { text: string; type: string }) => {
			const translationMap = {
				SAMLStartFailed: 'Failed to start SAML flow'
			};
			return translationMap[error.type] || error.text;
		},
		[]
	);

	if (isSessionLoading) {
		return <div>Loading...</div>;
	}
	return (
		<>
			<Descope
				flowId={process.env.DESCOPE_FLOW_ID || 'sign-up-or-in'}
				onSuccess={onSuccess}
				onError={onError}
				form={{ email: 'predefinedname@domain.com' }} // found in context key: form.email
				client={{ isMobile: false }} // found in context key: client.isMobile
				debug={process.env.DESCOPE_DEBUG_MODE === 'true'}
				theme={process.env.DESCOPE_THEME as any}
				locale={process.env.DESCOPE_LOCALE as string}
				redirectUrl={process.env.DESCOPE_REDIRECT_URL}
				tenant={process.env.DESCOPE_TENANT_ID}
				telemetryKey={process.env.DESCOPE_TELEMETRY_KEY}
				errorTransformer={errorTransformer}
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
