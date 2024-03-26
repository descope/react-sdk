// eslint-disable-next-line import/no-extraneous-dependencies
import createSdk from '@descope/web-js-sdk';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import AuthProvider from '../../src/components/AuthProvider';

Object.defineProperty(global, 'Response', {
	value: class {},
	configurable: true,
	writable: true
});

jest.mock('@descope/web-component', () => ({ default: {} }));

jest.mock('@descope/web-js-sdk', () => {
	const sdk = {
		logout: jest.fn().mockName('logout'),
		onSessionTokenChange: jest
			.fn(() => () => {})
			.mockName('onSessionTokenChange'),
		onUserChange: jest.fn(() => () => {}).mockName('onUserChange'),
		refresh: jest.fn(),
		httpClient: {
			hooks: {
				beforeRequest: jest.fn().mockName('before-request-hook'),
				afterRequest: jest.fn().mockName('after-request-hook')
			}
		}
	};
	return jest.fn(() => sdk);
});

describe('AuthProvider', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should init sdk config with default options', async () => {
		render(
			<AuthProvider projectId="pr1">
				<div>hello</div>
			</AuthProvider>
		);

		await waitFor(() => {
			expect(createSdk).toHaveBeenCalledWith(
				expect.objectContaining({
					projectId: 'pr1',
					persistTokens: true
				})
			);
		});
	});
	it('Should init sdk config with customized options', async () => {
		render(
			<AuthProvider
				projectId="pr1"
				persistTokens={false}
				storeLastAuthenticatedUser={false}
			>
				<div>hello</div>
			</AuthProvider>
		);

		await waitFor(() => {
			expect(createSdk).toHaveBeenCalledWith(
				expect.objectContaining({
					projectId: 'pr1',
					persistTokens: false,
					storeLastAuthenticatedUser: false
				})
			);
		});
	});
});
