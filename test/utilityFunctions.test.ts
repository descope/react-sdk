import createSdk, {
	getJwtPermissions,
	getJwtRoles,
	getRefreshToken,
	getSessionToken
} from '../src/lib/sdk';

jest.mock('@descope/web-js-sdk', () => () => ({
	getSessionToken: jest.fn(),
	getRefreshToken: jest.fn(),
	getJwtPermissions: jest.fn(),
	getJwtRoles: jest.fn()
}));

const sdk = createSdk({ projectId: 'test' });

describe('utility functions', () => {
	it('should call getSessionToken from sdk', () => {
		getSessionToken();
		expect(sdk.getSessionToken).toHaveBeenCalled();
	});

	it('should warn when using getSessionToken in non browser environment', () => {
		const warnSpy = jest.spyOn(console, 'warn');

		const origWindow = window;
		Object.defineProperty(global, 'window', {
			value: undefined,
			writable: true,
			configurable: true
		});

		jest.resetModules();

		// eslint-disable-next-line global-require
		const { getSessionToken: getSessionTokenLocal } = require('../src/lib/sdk');

		getSessionTokenLocal();

		global.window = origWindow;
		jest.resetModules();

		expect(warnSpy).toHaveBeenCalledWith(
			'Get session token is not supported in ssr'
		);
		expect(sdk.getSessionToken).not.toHaveBeenCalled();
	});

	it('should call getRefreshToken from sdk', () => {
		getRefreshToken();
		expect(sdk.getRefreshToken).toHaveBeenCalled();
	});

	it('should warn when using getRefreshToken in non browser environment', () => {
		const warnSpy = jest.spyOn(console, 'warn');

		const origWindow = window;
		Object.defineProperty(global, 'window', {
			value: undefined,
			writable: true,
			configurable: true
		});

		jest.resetModules();

		// eslint-disable-next-line global-require
		const { getRefreshToken: getRefreshTokenLocal } = require('../src/lib/sdk');

		getRefreshTokenLocal();

		global.window = origWindow;
		jest.resetModules();

		expect(warnSpy).toHaveBeenCalledWith(
			'Get refresh token is not supported in ssr'
		);
		expect(sdk.getRefreshToken).not.toHaveBeenCalled();
	});

	it('should call getJwtPermissions with the session token when not provided', () => {
		(sdk.getSessionToken as jest.Mock).mockReturnValueOnce('session');
		getJwtPermissions();
		expect(sdk.getJwtPermissions).toHaveBeenCalledWith('session', undefined);
	});

	it('should call getJwtRoles with the session token when not provided', () => {
		(sdk.getSessionToken as jest.Mock).mockReturnValueOnce('session');
		jest.spyOn(sdk, 'getJwtRoles').mockReturnValueOnce([]);
		getJwtRoles();
		expect(sdk.getJwtRoles).toHaveBeenCalledWith('session', undefined);
	});

	it('should call getJwtRoles with the session token when not provided', () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		jest.spyOn(sdk, 'getJwtRoles').mockImplementation(() => {
			throw new Error('session token');
		});
		getJwtRoles();
		expect(console.error).toHaveBeenCalled(); // eslint-disable-line no-console
	});
});
