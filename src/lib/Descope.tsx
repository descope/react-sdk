import React, {
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import '@descope/web-js-sdk'
import { DescopeCustomElement } from './types';


interface PropsType {
  projectId: string;
  flowId: string;
  onSuccess?: DescopeCustomElement['onsuccess'];
  onError?: DescopeCustomElement['onerror'];
}

const Descope = React.forwardRef<HTMLElement, PropsType>(
  ({ projectId, flowId, onSuccess, onError }, ref) => {
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

    return <descope-wc project={projectId} flow={flowId} ref={innerRef} />;
  }
);

Descope.defaultProps = {
  onError: undefined,
  onSuccess: undefined,
}

export default Descope