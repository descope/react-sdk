import '@descope/web-component';
import React, {
  useCallback, useEffect, useImperativeHandle,
  useRef
} from 'react';
import AuthContext from '../hooks/authContext';
import { DescopeProps } from '../types';


const Descope = React.forwardRef<HTMLElement, DescopeProps>(
  ({ flowId, onSuccess, onError }, ref) => {
    const innerRef = useRef<HTMLInputElement>();

    useImperativeHandle(ref, () => innerRef.current);

    const { projectId, baseUrl, setAuthenticated, setUser, setSessionToken } = React.useContext(AuthContext);

    const handleSuccess = useCallback((e: CustomEvent) => {
      setUser(e.detail?.user);
      setAuthenticated(true);
      setSessionToken(e.detail?.sessionJwt)
      if (onSuccess) {
        onSuccess(e);
      }
    }, [setUser, setAuthenticated, onSuccess]);

    useEffect(() => {
      const ele = innerRef.current;
      ele?.addEventListener('success', handleSuccess);
      if(onError) ele?.addEventListener('error', onError);

      return () => {
        if(onError) ele?.removeEventListener('error', onError);

        ele?.removeEventListener('success', handleSuccess);
      };
    }, [innerRef, onError, handleSuccess]);

    return <descope-wc project-id={projectId} flow-id={flowId} base-url={baseUrl} ref={innerRef} />;
  }
);

Descope.defaultProps = {
  onError: undefined,
  onSuccess: undefined
}

export default Descope