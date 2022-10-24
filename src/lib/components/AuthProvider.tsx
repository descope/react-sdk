// '@descope/web-js-sdk' is a dependency of '@descope/web-component'
// and we want to use the same version that is used there
// eslint-disable-next-line import/no-extraneous-dependencies
import createSdk from '@descope/web-js-sdk';
import React, { FC, useCallback, useMemo, useState } from 'react';
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
	const [authenticated, setAuthenticated] = useState(false);
	const [user, setUser] = useState({});
	const [sessionToken, setSessionToken] = useState('');

	const handleSessionTokenChanged = useCallback((newToken: string) => {
		setSessionToken(newToken);
		setAuthenticated(!!newToken)
	}, [setSessionToken, setAuthenticated]);

	const sdk = useMemo(() => {
		if (!projectId) {
			return null;
		}
		const newSdk = createSdk({ projectId, baseUrl });
		
		// subscribe to updates (TODO - remove any)
		newSdk.onSessionTokenChange(handleSessionTokenChanged as any)
		newSdk.onUserChange(setUser as any)
		// trigger refresh so session will be fetched
		newSdk.refresh();
		return newSdk;
	}, [projectId, baseUrl]);

	const value = useMemo<IAuthContext>(
		() => ({
			sdk,
			projectId,
			baseUrl,
			user,
			authenticated,
			sessionToken,
			setUser,
			setAuthenticated,
			setSessionToken
		}),
		[authenticated, user, projectId, baseUrl]
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.defaultProps = {
	baseUrl: '',
	children: undefined
};

export default AuthProvider;
