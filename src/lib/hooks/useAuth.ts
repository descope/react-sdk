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

	const getRefreshToken = useCallback(withValidation(sdk?.getRefreshToken), [
		sdk
	]);

	return useMemo(
		() => ({
			authenticated: !!sessionToken,
			user,
			sessionToken,
			logoutAll,
			logout,
			me,
			getJwtPermissions,
			getJwtRoles,
			/**
			 * Returns refresh token. Use this function when:
			 * 1. You need to pass refresh token to another party (For example, in SSR)
			 * 2. Descope project's configuration is set to manage token response in BODY (in contrast to manage response in COOKIES)
			 * NOTE: Use carefully! Refresh token is sensitive token with relativity long expiration. Prefer using this function only for testing, and to manage token response in COOKIES)
			 */
			getRefreshToken
		}),
		[user, sessionToken, sdk]
	);
};

export default useAuth;
