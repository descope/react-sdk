/* eslint-disable testing-library/no-node-access */
// eslint-disable-next-line import/no-extraneous-dependencies
import createSdk from '@descope/web-js-sdk';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import AuthProvider from '../../src/lib/components/AuthProvider';
import Descope from '../../src/lib/components/Descope';

Object.defineProperty(global, 'Response', {
	value: class {},
	configurable: true,
	writable: true
});

jest.mock('@descope/web-component', () => {});

jest.mock('@descope/web-js-sdk', () =>
	jest.fn(() => ({
		logout: jest.fn().mockName('logout'),
		onSessionTokenChange: jest.fn().mockName('onSessionTokenChange'),
		onUserChange: jest.fn().mockName('onUserChange'),
		refresh: jest.fn(),
		httpClient: {
			hooks: {
				afterRequest: jest.fn()
			}
		}
	}))
);

const renderWithProvider = (
	ui: React.ReactElement,
	projectId: string = 'project1',
	baseUrl?: string
) =>
	render(
		<AuthProvider projectId={projectId} baseUrl={baseUrl}>
			{ui}
		</AuthProvider>
	);

describe('Descope', () => {
	it('should render the WC with the correct props', async () => {
		renderWithProvider(<Descope flowId="flow1" />, 'proj1', 'url1');

		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toBeInTheDocument();
		});

		expect(document.querySelector('descope-wc')).toHaveAttribute(
			'project-id',
			'proj1'
		);
		expect(document.querySelector('descope-wc')).toHaveAttribute(
			'flow-id',
			'flow1'
		);
		expect(document.querySelector('descope-wc')).toHaveAttribute(
			'base-url',
			'url1'
		);
	});

	it('should register to the error event when received an onError cb', async () => {
		const onError = jest.fn();
		renderWithProvider(<Descope flowId="flow-1" onError={onError} />);
		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toBeInTheDocument();
		});
		fireEvent(document.querySelector('descope-wc'), new CustomEvent('error'));

		expect(onError).toHaveBeenCalled();
	});

	it('should register to the success event when received an onSuccess cb', async () => {
		const onSuccess = jest.fn();
		await renderWithProvider(<Descope flowId="flow-1" onSuccess={onSuccess} />);
		fireEvent(
			document.querySelector('descope-wc'),
			new CustomEvent('success', {
				detail: { user: { name: 'user1' }, sessionJwt: 'session1' }
			})
		);

		expect(onSuccess).toHaveBeenCalled();
	});

	it('should pass the ref to the wc element', async () => {
		const ref = jest.fn();
		renderWithProvider(<Descope flowId="flow-1" ref={ref} />);
		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toBeInTheDocument();
		});
		expect(ref).toHaveBeenCalledWith(document.querySelector('descope-wc'));
	});

	it('should add descope headers to request', async () => {
		const ref = jest.fn();
		renderWithProvider(<Descope flowId="flow-1" ref={ref} />);
		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toBeInTheDocument();
		});
		const returnedConf = (
			createSdk as jest.Mock
		).mock.calls[0][0].hooks.beforeRequest({
			headers: { test: '123' }
		});
		expect(returnedConf).toEqual({
			headers: {
				test: '123',
				'x-descope-sdk-name': 'react',
				'x-descope-sdk-version': 'one.two.three'
			}
		});
	});
});
