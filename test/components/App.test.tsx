import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import App from '../../src/app/App';
import { AuthProvider } from '../../src/lib';

jest.mock('@descope/web-component', () => {});

describe('App', () => {
	it('should get user on success', () => {
		render(
			<AuthProvider projectId="p1"> 
				<App flowId="flow-1" />
			</AuthProvider>
	);
		const showFlowButton = document.querySelector('button');
		fireEvent.click(showFlowButton);

		// success and make sure user 
		fireEvent(document.querySelector('descope-wc'), new CustomEvent('success', {
			detail: { user: { name: 'user1' }, sessionJwt: 'session1' }
		}));

		const username = document.querySelector('.username');
		expect(username.textContent).toContain('user1');
	});

	it('should show error message on error', () => {
		render(
			<AuthProvider projectId="p1"> 
				<App flowId="flow-1" />
			</AuthProvider>
	);
		const showFlowButton = document.querySelector('button');
		fireEvent.click(showFlowButton);

		// success and make sure user 
		fireEvent(document.querySelector('descope-wc'), new CustomEvent('error', {}));

		const error = document.querySelector('.error');
		expect(error).not.toBeNull();
	});
});
