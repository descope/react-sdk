import React, { useMemo } from 'react';
import AuthContext from './authContext';

const useAuth = () => {
	const ctx = React.useContext(AuthContext);
	if (!ctx) {
		throw Error('You can only use useAuth in the context of <AuthProvider />');
	}
	const { authenticated, user, sessionToken } = ctx;

	return useMemo(() => ({
		authenticated,
		user,
		sessionToken
	}), [authenticated, user, sessionToken]);
}

export default useAuth;