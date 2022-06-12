/* eslint-disable testing-library/no-node-access */
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import Descope from '../src/lib/Descope';

jest.mock('@descope/web-js-sdk', () => {});

describe('Descope', () => {
    it('should render the WC with the correct props', () => {
        render(<Descope projectId="proj1" flowId="flow1"/>);
        
        expect(document.querySelector('descope-wc')).toHaveAttribute('project', 'proj1')
        expect(document.querySelector('descope-wc')).toHaveAttribute('flow', 'flow1')
    })

    it('should register to the error event when received an onError cb', () => {
        const onError = jest.fn()
        render(<Descope projectId="1" flowId="1" onError={onError}/>);
        fireEvent(document.querySelector('descope-wc'), new CustomEvent('error'))
        
        expect(onError).toHaveBeenCalled()
    })

    it('should register to the success event when received an onSuccess cb', () => {
        const onSuccess = jest.fn()
        render(<Descope projectId="1" flowId="1" onSuccess={onSuccess}/>);
        fireEvent(document.querySelector('descope-wc'), new CustomEvent('success'))
        
        expect(onSuccess).toHaveBeenCalled()
    })

    it('should pass the ref to the wc element', () => {
        const ref = jest.fn()
        render(<Descope projectId="1" flowId="1" ref={ref}/>);
        expect(ref).toHaveBeenCalledWith(document.querySelector('descope-wc'))
    })
})