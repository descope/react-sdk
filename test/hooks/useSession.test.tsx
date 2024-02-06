import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useSession } from '../../src';
import Context from '../../src/hooks/Context';
import { IContext } from '../../src/types';

jest.mock('@descope/web-js-sdk', () => ({
	__esModule: true,
	default: jest.fn()
}));

const renderWithContext = (contextValue: IContext) =>
	renderHook(() => useSession(), {
		// Wrap the hook with the custom context provider
		wrapper: ({ children }) => (
			<Context.Provider value={contextValue}>{children}</Context.Provider>
		)
	});

describe('useSession', () => {
	it('should return the proper values when user is already authenticated', () => {
		const fetchSession = jest.fn();
		const session = 'session-token';
		const { result } = renderWithContext({
			session,
			isSessionLoading: false,
			fetchSession,
			isSessionFetched: false
		} as any as IContext);

		expect(result.current.isSessionLoading).toBe(false);
		expect(result.current.sessionToken).toBe(session);
		expect(result.current.isAuthenticated).toBe(true);

		expect(fetchSession).not.toHaveBeenCalled();
	});
});
