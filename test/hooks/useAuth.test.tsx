import React from 'react';
/* eslint-disable testing-library/no-node-access */
// eslint-disable-next-line import/no-extraneous-dependencies
import createSdk from '@descope/web-js-sdk';
import { renderHook } from '@testing-library/react';
import { AuthProvider, useSession } from '../../src/lib';
import useDescope from '../../src/lib/hooks/useDescope';
import useUser from '../../src/lib/hooks/useUser';

jest.mock('@descope/web-js-sdk', () => {
	const sdk = {
		logout: jest.fn().mockName('logout'),
		onSessionTokenChange: jest
			.fn(() => () => {})
			.mockName('onSessionTokenChange'),
		onUserChange: jest.fn(() => () => {}).mockName('onUserChange'),
		refresh: jest.fn(() => Promise.resolve()),
		httpClient: {
			hooks: {
				afterRequest: jest.fn()
			}
		}
	};
	return () => sdk;
});

// mock console.error to avoid those errors in tests
jest.spyOn(console, 'error').mockImplementation(() => {});

const { logout } = createSdk({ projectId: '' });

const authProviderWrapper =
	(projectId: string) =>
	({ children }: { children: any }) =>
		<AuthProvider projectId={projectId}>{children}</AuthProvider>;
describe('hooks', () => {
	it('should throw error when used without provider', () => {
		expect(() => {
			renderHook(() => useDescope());
		}).toThrowError();

		expect(() => {
			renderHook(() => useSession());
		}).toThrowError();

		expect(() => {
			renderHook(() => useUser());
		}).toThrowError();
	});

	it.each(['logoutAll', 'logout'])(
		'should throw error when using sdk function before sdk initialization - %s',
		(fnName) => {
			const { result } = renderHook(() => useDescope(), {
				wrapper: authProviderWrapper('')
			});
			expect(() => {
				result.current[fnName]();
			}).toThrowError();
		}
	);

	it('should get default values from provider', () => {
		const { result } = renderHook(() => useDescope(), {
			wrapper: authProviderWrapper('project1')
		});

		result.current.logout();
		expect(logout).toBeCalled();
	});

	it('should get default values from provider for useUser', () => {
		const { result } = renderHook(() => useUser(), {
			wrapper: authProviderWrapper('project1')
		});
		expect(result.current.user).toEqual(undefined);
	});

	it('should get default values from provider for useSession', () => {
		const { result } = renderHook(() => useSession(), {
			wrapper: authProviderWrapper('project1')
		});
		expect(result.current.isAuthenticated).toEqual(false);
		expect(result.current.sessionToken).toEqual(undefined);
	});
});
