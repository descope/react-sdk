import React, { useCallback, useMemo } from 'react';
import { IAuth } from '../types';
import AuthContext from './authContext';

/**
 * Wrap a function with a validation that it exists
 * @param fn The function to wrap with the validation
 * @throws if function does not exist, an error with the relevant message will be thrown
 */
const withValidation =
	<T extends Array<any>, U>(fn: (...args: T) => U) =>
	(...args: T): U => {
		if (!fn) {
			throw Error(
				`You can only use this function after sdk initialization. Make sure to supply 'projectId' to <AuthProvider /> component`
			);
		}
		return fn(...args);
	};

const useAuth = (): IAuth => {
	const ctx = React.useContext(AuthContext);
	if (!ctx) {
		throw Error(
			`You can only use 'useAuth' in the context of <AuthProvider />`
		);
	}
	const { user, sessionToken, sdk } = ctx;

	const logoutAll = useCallback(withValidation(sdk?.logoutAll), [sdk]);

	const logout = useCallback(withValidation(sdk?.logout), [sdk]);

	const me = useCallback(withValidation(sdk?.me), [sdk]);

	const getJwtPermissions = useCallback(
		withValidation(sdk?.getJwtPermissions),
		[sdk]
	);

	const getJwtRoles = useCallback(withValidation(sdk?.getJwtRoles), [sdk]);

	return useMemo(
		() => ({
			authenticated: !!sessionToken,
			user,
			sessionToken,
			logoutAll,
			logout,
			me,
			getJwtPermissions,
			getJwtRoles
		}),
		[user, sessionToken, sdk]
	);
};

export default useAuth;
