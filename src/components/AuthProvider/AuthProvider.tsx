import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Context from '../../hooks/Context';
import { IContext, User } from '../../types';
import { withValidation } from '../../utils';
import useSdk from './useSdk';

interface IAuthProviderProps {
	projectId: string;
	baseUrl?: string;
	// If true, session token (jwt) will be stored on cookie. Otherwise, the session token will be
	// stored on local storage and can accessed with getSessionToken function
	// Use this option if session token will stay small (less than 1k)
	// NOTE: Session token can grow, especially in cases of using authorization, or adding custom claims
	sessionTokenViaCookie?: boolean;
	children?: JSX.Element;
}

const AuthProvider: FC<IAuthProviderProps> = ({
	projectId,
	baseUrl,
	sessionTokenViaCookie,
	children
}) => {
	const [user, setUser] = useState<User>();
	const [session, setSession] = useState<string>();

	const [isUserLoading, setIsUserLoading] = useState(false);
	const [isSessionLoading, setIsSessionLoading] = useState(false);

	const sdk = useSdk({ projectId, baseUrl, sessionTokenViaCookie });

	useEffect(() => {
		if (sdk) {
			const unsubscribeSessionToken = sdk.onSessionTokenChange(setSession);
			const unsubscribeUser = sdk.onUserChange(setUser);

			return () => {
				unsubscribeSessionToken();
				unsubscribeUser();
			};
		}
		return undefined;
	}, [sdk]);

	const fetchSession = useCallback(() => {
		setIsSessionLoading(true);
		withValidation(sdk?.refresh)().then(() => {
			setIsSessionLoading(false);
		});
	}, [sdk]);

	const fetchUser = useCallback(() => {
		setIsUserLoading(true);
		withValidation(sdk.me)().then(() => {
			setIsUserLoading(false);
		});
	}, [sdk]);

	const logoutAll = useCallback(withValidation(sdk?.logoutAll), [sdk]);

	const logout = useCallback(withValidation(sdk?.logout), [sdk]);

	const value = useMemo<IContext>(
		() => ({
			fetchUser,
			user,
			isUserLoading,
			fetchSession,
			session,
			isSessionLoading,
			logout,
			logoutAll,
			projectId,
			baseUrl,
			setUser,
			setSession,
			sdk
		}),
		[
			fetchUser,
			user,
			isUserLoading,
			fetchSession,
			session,
			isSessionLoading,
			logout,
			logoutAll,
			projectId,
			baseUrl,
			setUser,
			setSession,
			sdk
		]
	);
	return <Context.Provider value={value}>{children}</Context.Provider>;
};

AuthProvider.defaultProps = {
	baseUrl: '',
	children: undefined,
	sessionTokenViaCookie: false
};

export default AuthProvider;
