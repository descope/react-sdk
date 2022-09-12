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

	const value = useMemo<IAuthContext>(
		() => ({
			user,
			authenticated,
			projectId,
			baseUrl,
			setUser,
			setAuthenticated
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
