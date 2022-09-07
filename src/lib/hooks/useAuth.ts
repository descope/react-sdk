import React, { useMemo } from 'react';
import { IAuthContext } from '../types';

export const AuthContext = React.createContext<IAuthContext>({
	user: {},
	authenticated: false,
	projectId: '',
	setUser: () => {},
	setAuthenticated: () => {}
});

export const useAuth = () => {
	const { authenticated, user, projectId, baseUrl } = React.useContext(AuthContext);

	return useMemo(() => ({
    projectId, 
    baseUrl,
		authenticated,
		user
	}), [projectId, baseUrl, authenticated, user]);
}