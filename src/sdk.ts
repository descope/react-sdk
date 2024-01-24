import createSdk from '@descope/web-js-sdk';
import { IS_BROWSER } from './constants';
import { wrapInTry } from './utils';

type Sdk = ReturnType<typeof createSdkWrapper>;
let globalSdk: Sdk;

const createSdkWrapper = <P extends Parameters<typeof createSdk>[0]>(
	config: P
) => {
	const sdk = createSdk({
		...config,
		persistTokens: IS_BROWSER as true,
		autoRefresh: IS_BROWSER as true
	});
	globalSdk = sdk;

	return sdk;
};

/**
 * We want to make sure the getSessionToken fn is used only when persistTokens is on
 *
 * So we are keeping the SDK init in a single place,
 * and we are creating a temp instance in order to export the getSessionToken
 * even before the SDK was init
 */
globalSdk = createSdkWrapper({ projectId: 'temp pid' });

export const getSessionToken = () => {
	if (IS_BROWSER) {
		return globalSdk?.getSessionToken();
	}

	// eslint-disable-next-line no-console
	console.warn('Get session token is not supported in SSR');
	return '';
};

export const getRefreshToken = () => {
	if (IS_BROWSER) {
		return globalSdk?.getRefreshToken();
	}
	// eslint-disable-next-line no-console
	console.warn('Get refresh token is not supported in SSR');
	return '';
};

export const getJwtPermissions = wrapInTry(
	(token = getSessionToken(), tenant?: string) =>
		globalSdk?.getJwtPermissions(token, tenant)
);

export const getJwtRoles = wrapInTry(
	(token = getSessionToken(), tenant?: string) =>
		globalSdk?.getJwtRoles(token, tenant)
);

export const refresh = (token = getRefreshToken()) => globalSdk?.refresh(token);

export const getGlobalSdk = () => globalSdk;

export default createSdkWrapper;
