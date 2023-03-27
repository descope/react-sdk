import { useMemo } from 'react';
import { Sdk } from '../types';
import useContext from './useContext';
import createSdk from '../sdk';

const validator = {
	// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
	get(target: Record<string, any>, key: string) {
		if (typeof target[key] === 'object' && target[key] !== null) {
			return new Proxy(target[key], validator);
		}
		if (typeof target[key] === 'function') {
			return () => {
				throw Error(
					`You can only use this function after sdk initialization. Make sure to supply 'projectId' to <AuthProvider /> component`
				);
			};
		}
		return target[key];
	}
};

const useDescope = (): Sdk => {
	const { sdk } = useContext();

	return useMemo(() => {
		if (!sdk) {
			const dummySdk = createSdk({ projectId: 'dummy' });

			return new Proxy(dummySdk, validator) as Sdk;
		}

		return sdk;
	}, [sdk]);

	return sdk;
};

export default useDescope;
