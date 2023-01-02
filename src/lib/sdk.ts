import createSdk from '@descope/web-js-sdk';

let sdkInstance;

const createSdkWrapper = <P extends Parameters<typeof createSdk>[0]>(
	config: P
) => {
	const sdk = createSdk({
		...config,
		persistTokens: true,
		autoRefresh: true
	});
	sdkInstance = sdk;
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

export const getSessionToken = () => sdkInstance?.getSessionToken();

export default createSdkWrapper;
