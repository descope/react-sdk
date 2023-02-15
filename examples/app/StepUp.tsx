import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Descope } from '../../src';
import { DescopeTheme } from '../../src/types';

const StepUp = () => {
	const [errorMessage, setErrorMessage] = useState('');

	const navigate = useNavigate();
	const onSuccess = useCallback(() => {
		setTimeout(() => {
			alert('Step Up Succeed!'); // eslint-disable-line no-alert
		}, 1);
		navigate('/');
	}, [navigate]);

	const onError = useCallback(() => {
		setErrorMessage('Something went wrong');
	}, [setErrorMessage]);
	return (
		<>
			<Descope
				flowId={process.env.DESCOPE_STEP_UP_FLOW_ID}
				onSuccess={onSuccess}
				onError={onError}
				debug={process.env.DESCOPE_DEBUG_MODE === 'true'}
				theme={process.env.DESCOPE_THEME as DescopeTheme}
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

export default StepUp;
