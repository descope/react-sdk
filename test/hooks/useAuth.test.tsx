import React from 'react';
/* eslint-disable testing-library/no-node-access */
import { renderHook } from '@testing-library/react';
import useAuth from '../../src/lib/hooks/useAuth';
import { AuthProvider } from '../../src/lib';


// mock console.error to avoid those errors in tests
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('useAuth', () => {
	it('should throw error when used without provider', () => {
		expect(() => {
			renderHook(() => useAuth());
		}).toThrowError();
	});

	it('should render t', () => {
		const wrapper = ({ children }) => {
			return (
				<AuthProvider projectId="project1">{children}</AuthProvider>
			);
		};
		const { result } = renderHook(() => useAuth(), { wrapper });
		expect(result.current.authenticated).toBeFalsy();
		expect(result.current.user).toEqual({});
	});
});
