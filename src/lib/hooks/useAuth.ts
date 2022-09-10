import React, { useMemo } from 'react';
import AuthContext from './authContext';

const useAuth = () => {
	const { authenticated, user, projectId, baseUrl } = React.useContext(AuthContext);

	return useMemo(() => ({
    projectId, 
    baseUrl,
		authenticated,
		user
	}), [projectId, baseUrl, authenticated, user]);
}

export default useAuth;