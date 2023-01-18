import { useEffect } from 'react';
import useAuthContext from './useAuthContext';

const useUser = () => {
	const { user, fetchUser, isUserLoading, session, isSessionLoading } =
		useAuthContext();

	useEffect(() => {
		if (!user && !isUserLoading && session && !isSessionLoading) {
			fetchUser();
		}
	}, [isSessionLoading, fetchUser]);

	return { isUserLoading, user };
};

export default useUser;
