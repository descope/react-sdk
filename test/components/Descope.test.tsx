/* eslint-disable testing-library/no-node-access */
// eslint-disable-next-line import/no-extraneous-dependencies
import createSdk from '@descope/web-js-sdk';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import AuthProvider from '../../src/lib/components/AuthProvider';
import Descope from '../../src/lib/components/Descope';

jest.mock('@descope/web-component', () => {});

jest.mock('@descope/web-js-sdk', () =>
	jest.fn(() => ({
		logout: jest.fn().mockName('logout'),
		onSessionTokenChange: jest.fn().mockName('onSessionTokenChange'),
		onUserChange: jest.fn().mockName('onUserChange')
	}))
);

const renderWithProvider = (
	ui: React.ReactElement,
	projectId: string = 'project1',
	baseUrl?: string
) => {
	render(
		<AuthProvider projectId={projectId} baseUrl={baseUrl}>
			{ui}
		</AuthProvider>
	);
};

describe('Descope', () => {
	it('should render the WC with the correct props', () => {
		renderWithProvider(<Descope flowId="flow1" />, 'proj1', 'url1');

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

	it('should register to the error event when received an onError cb', () => {
		const onError = jest.fn();
		renderWithProvider(<Descope flowId="flow-1" onError={onError} />);
		fireEvent(document.querySelector('descope-wc'), new CustomEvent('error'));

		expect(onError).toHaveBeenCalled();
	});

	it('should register to the success event when received an onSuccess cb', () => {
		const onSuccess = jest.fn();
		renderWithProvider(<Descope flowId="flow-1" onSuccess={onSuccess} />);
		fireEvent(
			document.querySelector('descope-wc'),
			new CustomEvent('success', {
				detail: { user: { name: 'user1' }, sessionJwt: 'session1' }
			})
		);

		expect(onSuccess).toHaveBeenCalled();
	});

	it('should pass the ref to the wc element', () => {
		const ref = jest.fn();
		renderWithProvider(<Descope flowId="flow-1" ref={ref} />);
		expect(ref).toHaveBeenCalledWith(document.querySelector('descope-wc'));
	});

	it('should add descope headers to request', () => {
		const ref = jest.fn();
		renderWithProvider(<Descope flowId="flow-1" ref={ref} />);
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
