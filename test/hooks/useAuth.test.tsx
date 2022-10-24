import React from 'react';
/* eslint-disable testing-library/no-node-access */
import createSdk from '@descope/web-js-sdk';
import { renderHook } from '@testing-library/react';
import { AuthProvider } from '../../src/lib';
import useAuth from '../../src/lib/hooks/useAuth';

jest.mock('@descope/web-js-sdk', () => {
	const sdk = {
		logout: jest.fn().mockName('logout'),
		refresh: jest.fn().mockName('refresh'),
		onSessionTokenChange: jest.fn().mockName('onSessionTokenChange'),
		onUserChange:jest.fn().mockName('onUserChange')
	};
	return () => sdk;
});

// mock console.error to avoid those errors in tests
jest.spyOn(console, 'error').mockImplementation(() => {});

const { logout } = createSdk({ projectId: '' });

const authProviderWrapper = (projectId: string) => 	({ children }) => {
	return (
		<AuthProvider projectId={projectId}>{children}</AuthProvider>
	);
};
describe('useAuth', () => {
	it('should throw error when used without provider', () => {
		expect(() => {
			renderHook(() => useAuth());
		}).toThrowError();
	});

	it('should throw error when using "logout" before sdk initialization', () => {
		const { result } = renderHook(() => useAuth(), { wrapper: authProviderWrapper('') });

		expect(() => {
			result.current.logout();
		}).toThrowError();
	});

	it('should throw error when using "me" before sdk initialization', () => {
		const { result } = renderHook(() => useAuth(), { wrapper: authProviderWrapper('') });

		expect(() => {
			result.current.me();
		}).toThrowError();
	});


	it('should get default values from provider', () => {
		const { result } = renderHook(() => useAuth(), { wrapper: authProviderWrapper('project1') });
		expect(result.current.authenticated).toBeFalsy();
		expect(result.current.user).toEqual({});
		expect(result.current.sessionToken).toEqual('');

		result.current.logout();
		expect(logout).toBeCalled();
	});
});
