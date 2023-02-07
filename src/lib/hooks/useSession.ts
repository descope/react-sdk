import { useMemo, useRef } from 'react';
import useContext from './useContext';

const useSession = () => {
	const { session, isSessionLoading, fetchSession } = useContext();
	// when session should be received, we want "isSessionLoading" to be true starting from the first call
	// (and not only when receiving an update from the context)
	const shouldGetSession = useRef(isSessionLoading);

	// we want this to happen before returning a value so we are using "useMemo" and not "useEffect"
	useMemo(() => {
		shouldGetSession.current = isSessionLoading;
	}, [isSessionLoading]);

	// we want this to happen before returning a value so we are using "useMemo" and not "useEffect"
	useMemo(() => {
		if (!session && !isSessionLoading) {
			shouldGetSession.current = true;
			fetchSession();
		}
	}, [fetchSession]);

	return {
		isSessionLoading: shouldGetSession.current,
		sessionToken: session,
		isAuthenticated: !!session
	};
};

export default useSession;
