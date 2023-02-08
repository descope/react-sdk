import { useEffect, useMemo, useRef, useState } from 'react';
import useContext from './useContext';

const useUser = () => {
	const { user, fetchUser, isUserLoading, session } = useContext();
	const [isInit, setIsInit] = useState(false); // we want to get the user only in the first time we got a session

	// when session should be received, we want "isUserLoading" to be true starting from the first call
	// (and not only when receiving an update from the context)
	const isLoading = useRef(isUserLoading);

	const shouldFetchUser = useMemo(
		() => !user && !isUserLoading && session && !isInit,
		[fetchUser, session, isInit]
	);

	// we want this to happen before returning a value so we are using "useMemo" and not "useEffect"
	useMemo(() => {
		isLoading.current = isUserLoading;
	}, [isUserLoading]);

	// we want this to happen before returning a value so we are using "useMemo" and not "useEffect"
	useMemo(() => {
		if (shouldFetchUser) {
			isLoading.current = true;
		}
	}, [shouldFetchUser]);

	useEffect(() => {
		if (shouldFetchUser) {
			setIsInit(true);
			fetchUser();
		}
	}, [shouldFetchUser]);

	return { isUserLoading: isLoading.current, user };
};

export default useUser;
