import React, { useMemo } from 'react';
import AuthContext from './authContext';

const useAuth = () => {
	const ctx = React.useContext(AuthContext);
	if (!ctx) {
		throw Error('You can only use useAuth in the context of <AuthProvider />');
	}
	const { projectId, baseUrl, authenticated, user, sessionToken } = ctx;

	return useMemo(() => ({
    projectId, 
    baseUrl,
		authenticated,
		user,
		sessionToken
	}), [projectId, baseUrl, authenticated, user, sessionToken]);
}

export default useAuth;