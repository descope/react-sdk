import React, { FC, useMemo, useState } from 'react';
import AuthContext from '../hooks/authContext';
import { IAuthContext } from '../types';

interface IAuthProviderProps {
	projectId: string;
	baseUrl?: string;
	children?: JSX.Element;
}

const AuthProvider: FC<IAuthProviderProps> = ({
	projectId,
	baseUrl,
	children
}) => {
	const [authenticated, setAuthenticated] = useState(false);
	const [user, setUser] = useState({});
	const [sessionToken, setSessionToken] = useState('');

	const value = useMemo<IAuthContext>(
		() => ({
			projectId,
			baseUrl,
			user,
			authenticated,
			sessionToken,
			setUser,
			setAuthenticated,
			setSessionToken
		}),
		[authenticated, user, projectId, baseUrl]
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.defaultProps = {
	baseUrl: '',
	children: undefined
};

export default AuthProvider;
