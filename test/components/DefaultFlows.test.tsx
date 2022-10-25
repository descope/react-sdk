import { render } from '@testing-library/react';
import React from 'react';
import { SignInFlow, SignUpFlow, SignUpOrInFlow } from '../../src/lib';
import AuthProvider from '../../src/lib/components/AuthProvider';

jest.mock('@descope/web-component', () => {});

jest.mock('@descope/web-js-sdk', () => {
	const sdk = {
		logout: jest.fn().mockName('logout'),
		onSessionTokenChange: jest.fn().mockName('onSessionTokenChange'),
		onUserChange:jest.fn().mockName('onUserChange')
	};
	return () => sdk;
});

function renderWithProvider(ui: React.ReactElement, projectId: string) {
	render(
			<AuthProvider projectId={projectId}> 
					{ui}
			</AuthProvider>
	);
}


describe('Default Flows', () => {
	it('should render Sign In with the correct props and flow', () => {
		renderWithProvider(<SignInFlow />, "proj1");
		expect(document.querySelector('descope-wc')).toHaveAttribute(
			'project-id',
			'proj1'
		);
		expect(document.querySelector('descope-wc')).toHaveAttribute(
			'flow-id',
			'sign-in'
		);
	});

	it('should render Sign Up with the correct props and flow', () => {
		renderWithProvider(<SignUpFlow />, "proj1");
		expect(document.querySelector('descope-wc')).toHaveAttribute(
			'project-id',
			'proj1'
		);
		expect(document.querySelector('descope-wc')).toHaveAttribute(
			'flow-id',
			'sign-up'
		);
	});

	it('should render Sign Up Or In In with the correct props and flow', () => {
		renderWithProvider(<SignUpOrInFlow />, "proj1");
		expect(document.querySelector('descope-wc')).toHaveAttribute(
			'project-id',
			'proj1'
		);
		expect(document.querySelector('descope-wc')).toHaveAttribute(
			'flow-id',
			'sign-up-or-in'
		);
	});
});
