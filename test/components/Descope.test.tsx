/* eslint-disable testing-library/no-node-access */
// eslint-disable-next-line import/no-extraneous-dependencies
import createSdk from '@descope/web-js-sdk';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
// eslint-disable-next-line import/no-named-default
import { default as DescopeWC } from '@descope/web-component';
import AuthProvider from '../../src/components/AuthProvider';
import Descope from '../../src/components/Descope';
import { baseHeaders } from '../../src';

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

const originalBaseHeaders = { ...baseHeaders };
describe('Descope', () => {
	afterEach(() => {
		// Reset baseHeaders
		Object.assign(baseHeaders, originalBaseHeaders);
		Object.keys(baseHeaders).forEach((key) => {
			if (!(key in originalBaseHeaders)) {
				// if key is not in original baseHeaders, delete it
				delete baseHeaders[key];
			}
		});
	});
	it('Should init sdk config', async () => {
		renderWithProvider(<Descope flowId="flow1" />, 'proj1', 'url1');

		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toBeInTheDocument();
		});

		// ensure the sdk was created with the correct config
		expect(DescopeWC.sdkConfigOverrides).toEqual({
			baseHeaders: {
				'x-descope-sdk-name': 'react',
				'x-descope-sdk-version': 'one.two.three'
			},
			persistTokens: false,
			hooks: {
				beforeRequest: expect.any(Function)
			}
		});

		// ensure beforeRequest hook was set with the correct value
		const { beforeRequest } = DescopeWC.sdkConfigOverrides.hooks;
		expect((beforeRequest as jest.Mock).getMockName()).toBe(
			'before-request-hook'
		);
	});

	it('Should be able to override bae headers', async () => {
		renderWithProvider(<Descope flowId="flow1" />, 'proj1', 'url1');
		baseHeaders['x-descope-sdk-name'] = 'foo';
		baseHeaders['x-some-property'] = 'bar';
		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toBeInTheDocument();
		});

		// ensure the sdk was created with the correct config
		expect(DescopeWC.sdkConfigOverrides).toEqual({
			baseHeaders: {
				'x-descope-sdk-name': 'foo',
				'x-descope-sdk-version': 'one.two.three',
				'x-some-property': 'bar'
			},
			persistTokens: false,
			hooks: {
				beforeRequest: expect.any(Function)
			}
		});
	});

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

	it('should pass logger and update web components logger', async () => {
		const logger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };
		renderWithProvider(<Descope flowId="flow-1" logger={logger} />);
		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toBeInTheDocument();
		});
		fireEvent(document.querySelector('descope-wc'), new CustomEvent('log'));

		expect(document.querySelector('descope-wc')).toHaveProperty(
			`logger`,
			logger
		);
	});

	it('should register to the success event when received an onSuccess cb', async () => {
		const onSuccess = jest.fn();
		renderWithProvider(<Descope flowId="flow-1" onSuccess={onSuccess} />);
		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toBeInTheDocument();
		});
		fireEvent(
			document.querySelector('descope-wc'),
			new CustomEvent('success', {
				detail: { user: { name: 'user1' }, sessionJwt: 'session1' }
			})
		);

		const sdk = createSdk({ projectId: '1' });
		const mockAfterRequest = sdk.httpClient.hooks.afterRequest as jest.Mock;
		await waitFor(() => expect(onSuccess).toHaveBeenCalled());
		expect(mockAfterRequest).toHaveBeenCalled();
		expect(mockAfterRequest).toHaveBeenCalledBefore(onSuccess);
	});

	it('should register to the ready event when received an onReady cb', async () => {
		const onReady = jest.fn();
		renderWithProvider(<Descope flowId="flow-1" onReady={onReady} />);
		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toBeInTheDocument();
		});
		fireEvent(
			document.querySelector('descope-wc'),
			new CustomEvent('ready', { detail: {} })
		);

		await waitFor(() => expect(onReady).toHaveBeenCalled());
	});

	it('should pass the ref to the wc element', async () => {
		const ref = jest.fn();
		renderWithProvider(<Descope flowId="flow-1" ref={ref} />);
		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toBeInTheDocument();
		});
		expect(ref).toHaveBeenCalledWith(document.querySelector('descope-wc'));
	});

	it('should pur error transformer on the component when passing it', async () => {
		const errorTransformer = jest.fn();
		renderWithProvider(
			<Descope flowId="flow-1" errorTransformer={errorTransformer} />
		);
		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toBeInTheDocument();
		});
		expect(document.querySelector('descope-wc')).toHaveProperty(
			`errorTransformer`,
			errorTransformer
		);
	});

	it('should add descope headers to request', async () => {
		const ref = jest.fn();
		renderWithProvider(<Descope flowId="flow-1" ref={ref} />);
		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toBeInTheDocument();
		});

		expect(createSdk).toHaveBeenCalledWith(
			expect.objectContaining({
				baseHeaders: {
					'x-descope-sdk-name': 'react',
					'x-descope-sdk-version': 'one.two.three'
				}
			})
		);
	});

	it('should render web-component with redirect-url when provided', async () => {
		renderWithProvider(
			<Descope flowId="flow-1" redirectUrl="http://custom.url" />
		);
		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toHaveAttribute(
				'redirect-url',
				'http://custom.url'
			);
		});
	});

	it('should render web-component with locale when provided', async () => {
		renderWithProvider(<Descope flowId="flow-1" locale="de" />);
		await waitFor(() => {
			expect(document.querySelector('descope-wc')).toHaveAttribute(
				'locale',
				'de'
			);
		});
	});
});
