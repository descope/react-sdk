// eslint-disable-next-line import/no-extraneous-dependencies
import createSdk from '@descope/web-js-sdk';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import AuthProvider from '../../src/components/AuthProvider';

jest.mock('@descope/web-js-sdk', () => jest.fn(() => {}));

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
