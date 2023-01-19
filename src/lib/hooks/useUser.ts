import { useEffect } from 'react';
import useContext from './useContext';

const useUser = () => {
	const { user, fetchUser, isUserLoading, session, isSessionLoading } =
		useContext();

	useEffect(() => {
		if (!user && !isUserLoading && session && !isSessionLoading) {
			fetchUser();
		}
	}, [isSessionLoading, fetchUser]);

	return { isUserLoading, user };
};

export default useUser;
