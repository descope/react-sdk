/* eslint-disable testing-library/no-node-access */
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import AuthProvider from '../../src/lib/components/AuthProvider';
import Descope from '../../src/lib/components/Descope';

jest.mock('@descope/web-component', () => {});

function renderWithProvider(ui: React.ReactElement, projectId: string = "1", baseUrl?: string) {
    render(
        <AuthProvider projectId={projectId} baseUrl={baseUrl}> 
            {ui}
        </AuthProvider>
    );
}

describe('Descope', () => {
	it('should render the WC with the correct props', () => {
		renderWithProvider(<Descope flowId="flow1" />, "proj1", "url1");

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
        renderWithProvider(<Descope flowId="" onError={onError} />);
		fireEvent(document.querySelector('descope-wc'), new CustomEvent('error'));

		expect(onError).toHaveBeenCalled();
	});

	it('should register to the success event when received an onSuccess cb', () => {
		const onSuccess = jest.fn();
        renderWithProvider(<Descope flowId="" onSuccess={onSuccess} />);
		fireEvent(document.querySelector('descope-wc'), new CustomEvent('success'));

		expect(onSuccess).toHaveBeenCalled();
	});

	it('should pass the ref to the wc element', () => {
		const ref = jest.fn();
        renderWithProvider(<Descope flowId="" ref={ref} />);
		expect(ref).toHaveBeenCalledWith(document.querySelector('descope-wc'));
	});
});