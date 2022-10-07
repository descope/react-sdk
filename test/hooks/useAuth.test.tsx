import React from 'react';
/* eslint-disable testing-library/no-node-access */
import createSdk from '@descope/web-js-sdk';
import { renderHook } from '@testing-library/react';
import { AuthProvider } from '../../src/lib';
import useAuth from '../../src/lib/hooks/useAuth';

jest.mock('@descope/web-js-sdk', () => {
	const sdk = {
		logout: jest.fn().mockName('logout')
	};
	return () => sdk;
});

// mock console.error to avoid those errors in tests
jest.spyOn(console, 'error').mockImplementation(() => {});

const { logout } = createSdk({ projectId: '' });

describe('useAuth', () => {
	it('should throw error when used without provider', () => {
		expect(() => {
			renderHook(() => useAuth());
		}).toThrowError();
	});

	it('should get default values from provider', () => {
		const wrapper = ({ children }) => {
			return (
				<AuthProvider projectId="project1">{children}</AuthProvider>
			);
		};
		const { result } = renderHook(() => useAuth(), { wrapper });
		expect(result.current.authenticated).toBeFalsy();
		expect(result.current.user).toEqual({});
		expect(result.current.sessionToken).toEqual('');

		result.current.logout();
		expect(logout).toBeCalled();
	});
});
