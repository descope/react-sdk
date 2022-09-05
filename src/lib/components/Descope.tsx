import React, {
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import '@descope/web-component'
import { DescopeCustomElement } from '../types';
import { AuthContext } from '../hooks/useAuth';


interface PropsType {
  flowId: string;
  onSuccess?: DescopeCustomElement['onsuccess'];
  onError?: DescopeCustomElement['onerror'];
}

const Descope = React.forwardRef<HTMLElement, PropsType>(
  ({ flowId, onSuccess, onError }, ref) => {
    const innerRef = useRef<HTMLInputElement>();

    useImperativeHandle(ref, () => innerRef.current);

    const { projectId, baseUrl } = React.useContext(AuthContext);


    useEffect(() => {
      const ele = innerRef.current;
      if(onError) ele?.addEventListener('error', onError);
      if(onSuccess) ele?.addEventListener('success', onSuccess);

      return () => {
        if(onError) ele?.removeEventListener('error', onError);
        if(onSuccess) ele?.removeEventListener('success', onSuccess);
      };
    }, [innerRef, onError, onSuccess]);

    return <descope-wc project-id={projectId} flow-id={flowId} base-url={baseUrl} ref={innerRef} />;
  }
);

Descope.defaultProps = {
  onError: undefined,
  onSuccess: undefined
}

export default Descope