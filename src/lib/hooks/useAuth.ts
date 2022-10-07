import React, { useMemo } from 'react';
import { IAuth } from '../types';
import AuthContext from './authContext';

const useAuth = (): IAuth => {
	const ctx = React.useContext(AuthContext);
	if (!ctx) {
		throw Error('You can only use useAuth in the context of <AuthProvider />');
	}
	const { authenticated, user, sessionToken, sdk } = ctx;

	return useMemo(() => ({
		authenticated,
		user,
		sessionToken,
		logout: sdk?.logout
	}), [authenticated, user, sessionToken, sdk]);
}

export default useAuth;