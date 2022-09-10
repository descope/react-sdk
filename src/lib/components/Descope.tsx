import React, {
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import '@descope/web-component'
import { DescopeCustomElement } from '../types';
import AuthContext from '../hooks/authContext';


interface PropsType {
  flowId: string;
  onSuccess?: DescopeCustomElement['onsuccess'];
  onError?: DescopeCustomElement['onerror'];
}

const Descope = React.forwardRef<HTMLElement, PropsType>(
  ({ flowId, onSuccess, onError }, ref) => {
    const innerRef = useRef<HTMLInputElement>();

    useImperativeHandle(ref, () => innerRef.current);

    const { projectId, baseUrl, setAuthenticated, setUser } = React.useContext(AuthContext);

    const handleSuccess = useCallback((e: CustomEvent) => {
      setUser(e?.detail?.user);
      setAuthenticated(true);
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