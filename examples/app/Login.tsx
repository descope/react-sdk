/* eslint-disable no-console */
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Descope, useSession } from '../../src';

const Login = () => {
	const [errorMessage, setErrorMessage] = useState('');
	const [flowLoading, setFlowLoading] = useState(true);

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

	const onPageUpdated = useCallback((e) => {
		const { isFirst } = e.detail;
		if (isFirst) {
			setFlowLoading(false);
		}
	}, []);

	const errorTransformer = useCallback(
		(error: { text: string; type: string }) => {
			const translationMap = {
				SAMLStartFailed: 'Failed to start SAML flow'
			};
			return translationMap[error.type] || error.text;
		},
		[]
	);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			{(isSessionLoading || flowLoading) && <div>Loading...</div>}
			{!isSessionLoading && (
				<Descope
					flowId={process.env.DESCOPE_FLOW_ID || 'sign-up-or-in'}
					onSuccess={onSuccess}
					onError={onError}
					onPageUpdated={onPageUpdated}
					// form={{ email: 'predefinedname@domain.com' }} // found in context key: form.email
					client={{ version: '1.0.2' }} // found in context key: client.version
					debug={process.env.DESCOPE_DEBUG_MODE === 'true'}
					theme={process.env.DESCOPE_THEME as any}
					locale={process.env.DESCOPE_LOCALE as string}
					redirectUrl={process.env.DESCOPE_REDIRECT_URL}
					tenant={process.env.DESCOPE_TENANT_ID}
					telemetryKey={process.env.DESCOPE_TELEMETRY_KEY}
					errorTransformer={errorTransformer}
				/>
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
		</div>
	);
};

export default Login;
