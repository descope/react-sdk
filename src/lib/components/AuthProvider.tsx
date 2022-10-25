// '@descope/web-js-sdk' is a dependency of '@descope/web-component'
// and we want to use the same version that is used there
// eslint-disable-next-line import/no-extraneous-dependencies
import createSdk from '@descope/web-js-sdk';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import AuthContext from '../hooks/authContext';
import { IAuthContext } from '../types';


interface IAuthProviderProps {
	projectId: string;
	baseUrl?: string;
	children?: JSX.Element;
}

const AuthProvider: FC<IAuthProviderProps> = ({
	projectId,
	baseUrl,
	children
}) => {
	const [user, setUser] = useState({});
	const [sessionToken, setSessionToken] = useState('');

	const handleSessionTokenChanged = useCallback((newToken: string) => {
		setSessionToken(newToken);
	}, [setSessionToken]);

	const sdk = useMemo(() => {
		if (!projectId) {
			return undefined;
		}
		return createSdk({ projectId, baseUrl });
	}, [projectId, baseUrl]);

	useEffect(() => {
		if (!sdk) {
			return undefined;
		}

		const unsubscribeSessionToken = sdk.onSessionTokenChange(handleSessionTokenChanged);
		const unsubscribeUser = sdk.onUserChange(setUser);
		return () => {
			unsubscribeSessionToken?.();
			unsubscribeUser?.();
		}
	}, [sdk])

	const value = useMemo<IAuthContext>(
		() => ({
			sdk,
			projectId,
			baseUrl,
			user,
			sessionToken,
			setUser,
			setSessionToken
		}),
		[sessionToken, user, projectId, baseUrl]
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.defaultProps = {
	baseUrl: '',
	children: undefined
};

export default AuthProvider;
