import React, {
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import '@descope/web-component'
import { DescopeCustomElement } from './types';


interface PropsType {
  projectId: string;
  flowId: string;
  baseUrl?: string;
  onSuccess?: DescopeCustomElement['onsuccess'];
  onError?: DescopeCustomElement['onerror'];
}

const Descope = React.forwardRef<HTMLElement, PropsType>(
  ({ projectId, flowId, baseUrl, onSuccess, onError }, ref) => {
    const innerRef = useRef<HTMLInputElement>();

    useImperativeHandle(ref, () => innerRef.current);

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
  onSuccess: undefined,
  baseUrl: undefined
}

export default Descope