import createSdk from '@descope/web-js-sdk';
import { IS_BROWSER } from './constants';

type Sdk = ReturnType<typeof createSdkWrapper>;
let sdkInstance: Sdk;

const createSdkWrapper = <P extends Parameters<typeof createSdk>[0]>(
	config: P
) => {
	let sdk: ReturnType<typeof createSdk>;
	if (IS_BROWSER) {
		sdk = createSdk({
			...config,
			persistTokens: true,
			autoRefresh: true
		});
		sdkInstance = sdk;
	} else {
		sdk = createSdk({
			...config,
			persistTokens: true,
			autoRefresh: true
		});
		sdkInstance = sdk;
	}

	return sdk;
};

/**
 * We want to make sure the getSessionToken fn is used only when persistTokens is on
 *
 * So we are keeping the SDK init in a single place,
 * and we are creating a temp instance in order to export the getSessionToken
 * even before the SDK was init
 */
sdkInstance = createSdkWrapper({ projectId: 'temp pid' });

export const getSessionToken = () => {
	if (IS_BROWSER) {
		return sdkInstance?.getSessionToken();
	}
	return '';
};

export const getJwtPermissions = (token = getSessionToken(), tenant?: string) =>
	sdkInstance?.getJwtPermissions(token, tenant);
export const getJwtRoles = (token = getSessionToken(), tenant?: string) =>
	sdkInstance?.getJwtRoles(token, tenant);
export const getRefreshToken = () => sdkInstance?.getRefreshToken();

export default createSdkWrapper;
