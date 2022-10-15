import React, { useCallback, useMemo } from 'react';
import { IAuth, Sdk } from '../types';
import AuthContext from './authContext';

const useAuth = (): IAuth => {
	const ctx = React.useContext(AuthContext);
	if (!ctx) {
		throw Error(`You can only use 'useAuth' in the context of <AuthProvider />`);
	}
	const { authenticated, user, sessionToken, sdk } = ctx;

	const logout = useCallback((...args: Parameters<Sdk['logout']>) => {
		if (!sdk) {
			throw Error(`You can only use 'logout' after sdk initialization. Make sure to supply 'projectId' to <AuthProvider /> component`);
		}
		return sdk.logout(...args);
	}, [sdk])

	return useMemo(() => ({
		authenticated,
		user,
		sessionToken,
		logout
	}), [authenticated, user, sessionToken, sdk]);
}

export default useAuth;