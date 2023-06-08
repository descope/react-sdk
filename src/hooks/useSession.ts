import { useEffect, useMemo, useRef } from 'react';
import useContext from './useContext';

const useSession = () => {
	const { session, isSessionLoading, fetchSession } = useContext();

	// when session should be received, we want the return value of "isSessionLoading" to be true starting from the first call
	// (and not only when receiving an update from the context)
	const isLoading = useRef(isSessionLoading);

	// we want this to happen before returning a value so we are using "useMemo" and not "useEffect"
	useMemo(() => {
		console.log('@@@ useMemo1 change loading to ', isSessionLoading);
		isLoading.current = isSessionLoading;
	}, [isSessionLoading]);

	// we want this to happen before returning a value so we are using "useMemo" and not "useEffect"
	useMemo(() => {
		if (!session && !isSessionLoading) {
			console.log('@@@ useMemo2 change loading', { session, isSessionLoading });
			isLoading.current = true;
		}
	}, [fetchSession]);

	useEffect(() => {
		if (!session && !isSessionLoading) {
			fetchSession();
		}
	}, [fetchSession]);

	console.log('@@@ returning', isLoading.current);
	return {
		isSessionLoading: isLoading.current,
		sessionToken: session,
		isAuthenticated: !!session
	};
};

export default useSession;
