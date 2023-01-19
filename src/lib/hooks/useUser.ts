import { useEffect, useState } from 'react';
import useContext from './useContext';

const useUser = () => {
	const { user, fetchUser, isUserLoading, session, isSessionLoading } =
		useContext();
	const [isInit, setIsInit] = useState(false); // we want to get the user only in the first time we got a session

	useEffect(() => {
		if (!user && !isUserLoading && session && !isSessionLoading && !isInit) {
			setIsInit(true);
			fetchUser();
		}
	}, [isSessionLoading, fetchUser, session, isInit]);

	return { isUserLoading, user };
};

export default useUser;
