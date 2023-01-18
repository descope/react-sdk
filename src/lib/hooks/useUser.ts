import { useEffect } from 'react';
import useAuthContext from './useAuthContext';
import { IAuth } from '../types';

const useUser: IAuth['useUser'] = () => {
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
