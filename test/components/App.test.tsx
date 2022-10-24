import createSdk from '@descope/web-js-sdk';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import App from '../../src/app/App';
import { AuthProvider } from '../../src/lib';

jest.mock('@descope/web-component', () => {});

jest.mock('@descope/web-js-sdk', () => {
	const sdk = {
		logout: jest.fn().mockName('logout'),
		refresh: jest.fn().mockName('refresh'),
		onSessionTokenChange: jest.fn().mockName('onSessionTokenChange'),
		onUserChange:jest.fn().mockName('onUserChange')
	};
	return () => sdk;
});

const { logout } = createSdk({ projectId: '' });


describe('App', () => {
	it('should get user on success', () => {
		render(
			<AuthProvider projectId="p1"> 
				<App flowId="flow-1" />
			</AuthProvider>
	);
		const showFlowButton = document.querySelector('.start-button');
		fireEvent.click(showFlowButton);

		// mock success
		fireEvent(document.querySelector('descope-wc'), new CustomEvent('success', {
			detail: { user: { name: 'user1' }, sessionJwt: 'session1' }
		}));

		// ensure user details are shown
		const username = document.querySelector('.username');
		expect(username.textContent).toContain('user1');
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
		fireEvent(document.querySelector('descope-wc'), new CustomEvent('error', {}));

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
		fireEvent(document.querySelector('descope-wc'), new CustomEvent('success', {
			detail: { user: { name: 'user1' }, sessionJwt: 'session1' }
		}));

		// logout
		const logoutButton = document.querySelector('.logout-button');
		fireEvent.click(logoutButton);

		// ensure logout called
		expect(logout).toBeCalled();
	});
});
