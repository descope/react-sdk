import React, { FC, useMemo, useState } from 'react';
import { AuthContext } from '../hooks/useAuth';
import { IAuthContext } from '../types';

interface IAuthProviderProps {
	projectId: string;
	baseUrl?: string;
	children?: any;
}

const AuthProvider: FC<IAuthProviderProps> = ({
	projectId,
	baseUrl,
	children
}) => {
	const [authenticated, setAuthenticated] = useState(false);
	const [user, setUser] = useState({});

	return (
		<AuthContext.Provider
			value={useMemo<IAuthContext>(
				() => ({
					user,
					authenticated,
					projectId,
					baseUrl,
					setUser,
					setAuthenticated
				}),
				[authenticated, user, projectId, baseUrl]
			)}
		>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.defaultProps = {
	baseUrl: '',
	children: undefined
};

export default AuthProvider;
