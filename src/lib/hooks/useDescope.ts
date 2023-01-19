import { useMemo } from 'react';
import { IAuth } from '../types';
import useAuthContext from './useAuthContext';

const useDescope = (): IAuth => {
	const { logout, logoutAll } = useAuthContext();

	return useMemo(
		() => ({
			logoutAll,
			logout
		}),
		[logoutAll, logout]
	);
};

export default useDescope;
