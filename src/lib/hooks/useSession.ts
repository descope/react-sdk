import { useEffect } from 'react';
import useAuthContext from './useAuthContext';

const useSession = () => {
	const { session, isSessionLoading, fetchSession } = useAuthContext();

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

export default useSession;
