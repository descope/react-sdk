import { useMemo } from 'react';
import { Sdk } from '../types';
import useContext from './useContext';
import { createTempSdk } from '../sdk';

const generateErrorMsg = (entryType: string) =>
	`You can only use this ${entryType} after sdk initialization. Make sure to supply 'projectId' to <AuthProvider /> component`;

// handler which throw an error for every SDK function
const proxyThrowHandler = {
	// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
	get(target: Record<string, any>, key: string) {
		if (typeof target[key] === 'object' && target[key] !== null) {
			return new Proxy(target[key], proxyThrowHandler);
		}

		if (typeof target[key] === 'function') {
			return () => {
				throw Error(generateErrorMsg('function'));
			};
		}

		throw Error(generateErrorMsg('attribute'));
	}
};

const useDescope = (): Sdk => {
	const { sdk } = useContext();

	return useMemo(() => {
		if (!sdk) {
			// In case the SDK is not initialized, we want to throw an error when the SDK functions are called
			return new Proxy(createTempSdk(), proxyThrowHandler) as Sdk;
		}

		return sdk;
	}, [sdk]);
};

export default useDescope;
