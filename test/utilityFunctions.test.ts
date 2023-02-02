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
	it('should call getRefreshToken from sdk', () => {
		getRefreshToken();
		expect(sdk.getRefreshToken).toHaveBeenCalled();
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
