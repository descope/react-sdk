import React, {
  useImperativeHandle,
  DOMAttributes,
  useRef,
  useEffect,
} from 'react';
import DescopeWc from '@descope/web-js-sdk';

type CustomEvents<K extends string> = {
  [key in K]: (event: CustomEvent) => void;
};
type CustomElement<T, K extends string = ''> = Partial<
  T &
    DOMAttributes<T> & {
      children: React.ReactChild;
      ref: React.Ref<HTMLElement>;
    } & CustomEvents<`on${K}`>
>;

type DescopeCustomElement = CustomElement<DescopeWc, 'success' | 'error'>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['descope-wc']: DescopeCustomElement;
    }
  }
}

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