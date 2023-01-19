import { useEffect } from 'react';
import useContext from './useContext';

const useAuth = () => {
	const { session, isSessionLoading, fetchSession } = useContext();

	useEffect(() => {
		if (!session && !isSessionLoading) {
			fetchSession();
		}
	}, [fetchSession]);

	return {
		isSessionLoading,
		sessionToken: session,
		isAuthenticated: !!session
	};
};

export default useAuth;
