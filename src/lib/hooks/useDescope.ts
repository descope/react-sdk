import { useMemo } from 'react';
import { IAuth } from '../types';
import useContext from './useContext';

const useDescope = (): IAuth => {
	const { logout, logoutAll } = useContext();

	return useMemo(
		() => ({
			logoutAll,
			logout
		}),
		[logoutAll, logout]
	);
};

export default useDescope;
