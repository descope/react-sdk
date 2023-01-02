import React, { FC, useEffect, useMemo, useState } from 'react';
import createSdk from '../sdk';
import AuthContext from '../hooks/authContext';
import { IAuthContext } from '../types';

declare const BUILD_VERSION: string;

interface IAuthProviderProps {
	projectId: string;
	baseUrl?: string;
	// If true, session token (jwt) will be stored on cookie. Otherwise, the session token will be
	// stored on local storage and can accessed with getSessionToken function
	// Use this option if session token will stay small (less than 1k)
	// NOTE: Session token can grow, especially in cases of using authorization, or adding custom claims
	sessionTokenViaCookie?: boolean;
	children?: JSX.Element;
}

const AuthProvider: FC<IAuthProviderProps> = ({
	projectId,
	baseUrl,
	sessionTokenViaCookie,
	children
}) => {
	const [user, setUser] = useState({});
	const [sessionToken, setSessionToken] = useState('');

	const sdk = useMemo(() => {
		if (!projectId) {
			return undefined;
		}
		return createSdk({
			projectId,
			baseUrl,
			sessionTokenViaCookie,
			hooks: {
				beforeRequest: (config) => {
					const conf = config;
					conf.headers = {
						...conf.headers,
						'x-descope-sdk-name': 'react',
						'x-descope-sdk-version': BUILD_VERSION
					};
					return conf;
				}
			},
			persistToken: true,
			autoRefresh: true
		});
	}, [projectId, baseUrl]);

	useEffect(() => {
		if (!sdk) {
			return undefined;
		}

		const unsubscribeSessionToken = sdk.onSessionTokenChange(setSessionToken);
		const unsubscribeUser = sdk.onUserChange(setUser);
		// we are calling refresh once after creating the SDK instance
		// so if refresh token exists, the user will be logged in automatically
		sdk.refresh();
		return () => {
			unsubscribeSessionToken?.();
			unsubscribeUser?.();
		};
	}, [sdk]);

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
	children: undefined,
	sessionTokenViaCookie: false
};

export default AuthProvider;
