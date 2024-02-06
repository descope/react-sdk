import { useEffect, useMemo, useRef } from 'react';
import useContext from './useContext';

const useSession = () => {
	const { session, isSessionLoading, fetchSession, isSessionFetched } =
		useContext();

	// when session should be received, we want the return value of "isSessionLoading" to be true starting from the first call
	// (and not only when receiving an update from the context)
	const isLoading = useRef(isSessionLoading);

	// we want this to happen before returning a value so we are using "useMemo" and not "useEffect"
	useMemo(() => {
		isLoading.current = isSessionLoading;
	}, [isSessionLoading]);

	// we want this to happen before returning a value so we are using "useMemo" and not "useEffect"
	useMemo(() => {
		console.log('@@@ useSession memo1', {
			isSessionFetched
		});
		if (!isSessionFetched) {
			console.log('@@@ useSession memo1, changing to true');
			isLoading.current = true;
		}
	}, [isSessionFetched]);

	useEffect(() => {
		console.log('@@@ useSession effect1', {
			session: session ? 'exists' : 'does not exist',
			isSessionLoading
		});
		if (!session && !isSessionLoading) {
			console.log('@@@ useSession effect1 triggering fetchSession');
			fetchSession();
		}
	}, [fetchSession]);

	console.log('@@@ useSession returning isSessionLoading ', isLoading.current);
	return {
		isSessionLoading: isLoading.current,
		sessionToken: session,
		isAuthenticated: !!session
	};
};

export default useSession;
