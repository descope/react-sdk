/* eslint-disable testing-library/no-node-access */
// eslint-disable-next-line import/no-extraneous-dependencies
import createSdk from '@descope/web-js-sdk';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import App from '../../src/app/App';
import { AuthProvider } from '../../src/lib';

jest.mock('@descope/web-component', () => {});

jest.mock('@descope/web-js-sdk', () => {
	const sdk = {
		logout: jest.fn().mockName('logout'),
		onSessionTokenChange: jest.fn().mockName('onSessionTokenChange'),
		onUserChange: jest.fn().mockName('onUserChange')
	};
	return () => sdk;
});

const { logout, onSessionTokenChange, onUserChange } = createSdk({
	projectId: ''
});

describe('App', () => {
	afterEach(() => {
		// reset mock functions that may be override
		(onSessionTokenChange as jest.Mock).mockImplementation();
		(onUserChange as jest.Mock).mockImplementation();
	});

	it('should get user on success', () => {
		render(
			<AuthProvider projectId="p1">
				<App flowId="flow-1" />
			</AuthProvider>
		);
		const showFlowButton = document.querySelector('.start-button');
		fireEvent.click(showFlowButton);

		// mock success
		fireEvent(
			document.querySelector('descope-wc'),
			new CustomEvent('success', {
				detail: { user: { name: 'user1' }, sessionJwt: 'session1' }
			})
		);

		// ensure user details are shown
		const username = document.querySelector('.username');
		expect(username).toHaveTextContent(/user1/);
	});

	it('should subscribe to user and session token', () => {
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
		render(
			<AuthProvider projectId="p1">
				<App flowId="flow-1" />
			</AuthProvider>
		);

		expect(onSessionTokenChange).toBeCalled();
		expect(onUserChange).toBeCalled();

		// ensure user details are shown
		const username = document.querySelector('.username');
		expect(username).toHaveTextContent(/user1/);
	});

	it('should show error message on error', () => {
		render(
			<AuthProvider projectId="p1">
				<App flowId="flow-1" />
			</AuthProvider>
		);
		const showFlowButton = document.querySelector('.start-button');
		fireEvent.click(showFlowButton);

		// mock error
		fireEvent(
			document.querySelector('descope-wc'),
			new CustomEvent('error', {})
		);

		// ensure error is shown
		const error = document.querySelector('.error');
		expect(error).not.toBeNull();
	});

	it('should render logout button and and call sdk logout', () => {
		render(
			<AuthProvider projectId="p1">
				<App flowId="flow-1" />
			</AuthProvider>
		);
		const showFlowButton = document.querySelector('.start-button');
		fireEvent.click(showFlowButton);

		// mock success
		fireEvent(
			document.querySelector('descope-wc'),
			new CustomEvent('success', {
				detail: { user: { name: 'user1' }, sessionJwt: 'session1' }
			})
		);

		// logout
		const logoutButton = document.querySelector('.logout-button');
		fireEvent.click(logoutButton);

		// ensure logout called
		expect(logout).toBeCalled();
	});
});
