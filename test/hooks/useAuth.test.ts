/* eslint-disable testing-library/no-node-access */
import { renderHook } from '@testing-library/react';
import useAuth from '../../src/lib/hooks/useAuth';

describe('useAuth', () => {
	it('should render the WC with the correct props', () => {
		const { result } = renderHook(() => useAuth());
		expect(result.current.authenticated).toBeFalsy();
		expect(result.current.user).toEqual({});
	})
});
