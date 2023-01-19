import React, { useMemo } from 'react';
import { IAuth } from '../types';
import AuthContext from './authContext';
import useAuthContext from './useAuthContext';

const useDescope = (): IAuth => {
	const ctx = React.useContext(AuthContext);
	if (!ctx) {
		throw Error(
			`You can only use 'useAuth' in the context of <AuthProvider />`
		);
	}
	const { logout, logoutAll } = useAuthContext();

	return useMemo(
		() => ({
			logoutAll,
			logout
		}),
		[logoutAll, logout]
	);
};

export default useDescope;
