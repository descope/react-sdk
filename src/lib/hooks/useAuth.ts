import React from 'react';
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

	return {
    projectId, 
    baseUrl,
		authenticated,
		user
	}
}