import React from 'react';
import { IAuthContext } from '../types';

const AuthContext = React.createContext<IAuthContext>({
	user: {},
	authenticated: false,
	projectId: '',
	setUser: () => {},
	setAuthenticated: () => {}
});

export default AuthContext;