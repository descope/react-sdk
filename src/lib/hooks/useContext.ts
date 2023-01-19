import { useContext } from 'react';
import Context from './Context';

export default () => {
	const ctx = useContext(Context);
	if (!ctx) {
		throw Error(
			`You can only use this hook in the context of <AuthProvider />`
		);
	}

	return ctx;
};
