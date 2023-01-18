import { useEffect } from 'react';
import useAuthContext from './useAuthContext';
import { IAuth } from '../types';

const useSession: IAuth['useSession'] = () => {
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
