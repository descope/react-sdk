/* eslint-disable testing-library/no-node-access */
// eslint-disable-next-line import/no-extraneous-dependencies
import createSdk from '@descope/web-js-sdk';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../examples/app/App';
import { AuthProvider } from '../../src';

Object.defineProperty(global, 'Response', {
	value: class {},
	configurable: true,
	writable: true
});

jest.mock('@descope/web-component', () => ({ default: {} }));

jest.mock('@descope/web-js-sdk', () => {
	const sdk = {
		logout: jest.fn().mockName('logout'),
		onSessionTokenChange: jest.fn().mockName('onSessionTokenChange'),
		onUserChange: jest.fn().mockName('onUserChange'),
		getSessionToken: jest.fn().mockName('getSessionToken'),
		getJwtRoles: jest.fn().mockName('getJwtRoles'),
		refresh: jest.fn(() => Promise.resolve()),
		httpClient: {
			hooks: {
				afterRequest: jest.fn()
			}
		}
	};
	return () => sdk;
});

const renderWithRouter = (ui: React.ReactElement) =>
	render(<MemoryRouter>{ui}</MemoryRouter>);

const { logout, onSessionTokenChange, onUserChange, refresh } = createSdk({
	projectId: ''
});

describe('App', () => {
	beforeEach(() => {
		// reset mock functions that may be override
		(onSessionTokenChange as jest.Mock).mockImplementation(() => () => {});
		(onUserChange as jest.Mock).mockImplementation(() => () => {});
	});

	it('should subscribe to user and session token', async () => {
		(onSessionTokenChange as jest.Mock).mockImplementation((cb) => {
			expect(cb).toBeTruthy();
			cb('token1');
			return () => {};
		});

		(onUserChange as jest.Mock).mockImplementation((cb) => {
			expect(cb).toBeTruthy();
			cb({ name: 'user1' });
			return () => {};
		});
		renderWithRouter(
			<AuthProvider projectId="p1">
				<App />
			</AuthProvider>
		);

		expect(onSessionTokenChange).toBeCalled();
		expect(onUserChange).toBeCalled();

		// ensure user details are shown
		await screen.findByText(/user1/);
	});

	it('should show error message on error', async () => {
		const { container } = renderWithRouter(
			<AuthProvider projectId="p1">
				<App />
			</AuthProvider>
		);
		const loginButton = await screen.findByText('Login');
		fireEvent.click(loginButton);

		await waitFor(() =>
			// eslint-disable-next-line testing-library/no-container
			expect(container.querySelector('descope-wc')).toBeInTheDocument()
		);

		// mock error
		fireEvent(
			// eslint-disable-next-line testing-library/no-container
			container.querySelector('descope-wc'),
			new CustomEvent('error', {})
		);

		// ensure error is shown
		const error = document.querySelector('.error');
		expect(error).not.toBeNull();
	});

	it('should render logout button and and call sdk logout', async () => {
		(onSessionTokenChange as jest.Mock).mockImplementation((cb) => {
			cb('token1');
			return () => {};
		});
		(onUserChange as jest.Mock).mockImplementation((cb) => {
			cb({ name: 'user1' });
			return () => {};
		});
		renderWithRouter(
			<AuthProvider projectId="p1">
				<App />
			</AuthProvider>
		);

		// logout
		await screen.findByText('Logout');
		fireEvent.click(screen.getByText('Logout'));

		// ensure logout called
		expect(logout).toBeCalled();
	});

	it('should call refresh only once when useSession used twice', async () => {
		// rendering App twice which uses useSession
		renderWithRouter(
			<AuthProvider projectId="p1">
				<>
					<App />
					<App />
				</>
			</AuthProvider>
		);

		// ensure refresh called only once
		expect(refresh).toBeCalledTimes(1);
	});
});
