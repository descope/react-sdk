import React, { useCallback, useMemo } from 'react';
import { IAuth, Sdk } from '../types';
import AuthContext from './authContext';

/**
 * Wrap a function with a validation that the sdk argument exists
 * @param fn The function to wrap with the validation
 * @param fnName The function name, to embed in the error message, in case it is thrown
 * @param sdk The sdk to validate it existence
 * @throws if sdk does not exist, an error with the relevant message will be thrown
 */
const withSdkValidation =
	<T extends Array<any>, U>(fn: (...args: T) => U, fnName: string, sdk: Sdk) =>
	(...args: T): U => {
		if (!sdk) {
			throw Error(
				`You can only use '${fnName}' after sdk initialization. Make sure to supply 'projectId' to <AuthProvider /> component`
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

	const logoutAll = useCallback(
		withSdkValidation(sdk?.logoutAll, 'logoutAll', sdk),
		[sdk]
	);

	const logout = useCallback(withSdkValidation(sdk?.logout, 'logout', sdk), [
		sdk
	]);

	const me = useCallback(withSdkValidation(sdk?.me, 'me', sdk), [sdk]);

	const getJwtPermissions = useCallback(
		withSdkValidation(sdk?.getJwtPermissions, 'getJwtPermissions', sdk),
		[sdk]
	);

	const getJwtRoles = useCallback(
		withSdkValidation(sdk?.getJwtRoles, 'getJwtRoles', sdk),
		[sdk]
	);

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
