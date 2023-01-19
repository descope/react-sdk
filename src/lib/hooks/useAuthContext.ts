import { useContext } from 'react';
import AuthContext from './authContext';

export default () => {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw Error(
			`You can only use this hook in the context of <AuthProvider />`
		);
	}

	return ctx;
};
