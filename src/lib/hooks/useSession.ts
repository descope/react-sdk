import { useEffect } from 'react';
import useContext from './useContext';

const useSession = () => {
	const { session, isSessionLoading, fetchSession } = useContext();

	useEffect(() => {
		if (!session && !isSessionLoading) {
			fetchSession();
		}
	}, [fetchSession, session, isSessionLoading]);

	return {
		isSessionLoading,
		sessionToken: session,
		isAuthenticated: !!session
	};
};

export default useSession;
