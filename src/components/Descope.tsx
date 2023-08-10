import React, {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState
} from 'react';
import { baseHeaders } from '../constants';
import Context from '../hooks/Context';
import { DescopeProps } from '../types';

// web-component code uses browser API, but can be used in SSR apps, hence the lazy loading
const DescopeWC = lazy(async () => {
	const module = await import('@descope/web-component');
	// we want to override the web-component base headers so we can tell that is was used via the React SDK
	module.default.sdkConfigOverrides = { baseHeaders };

	return {
		default: ({
			projectId,
			flowId,
			baseUrl,
			innerRef,
			tenant,
			theme,
			locale,
			debug,
			telemetryKey,
			redirectUrl,
			autoFocus
		}) => (
			<descope-wc
				project-id={projectId}
				flow-id={flowId}
				base-url={baseUrl}
				ref={innerRef}
				tenant={tenant}
				theme={theme}
				locale={locale}
				debug={debug}
				telemetryKey={telemetryKey}
				redirect-url={redirectUrl}
				auto-focus={autoFocus}
			/>
		)
	};
});

const Descope = React.forwardRef<HTMLElement, DescopeProps>(
	(
		{
			flowId,
			onSuccess,
			onError,
			onNext,
			tenant,
			theme,
			locale,
			debug,
			telemetryKey,
			redirectUrl,
			autoFocus,
			errorTransformer
		},
		ref
	) => {
		const [innerRef, setInnerRef] = useState(null);

		useImperativeHandle(ref, () => innerRef);

		const { projectId, baseUrl, sdk } = React.useContext(Context);

		const handleSuccess = useCallback(
			async (e: CustomEvent) => {
				// In order to make sure all the after-hooks are running with the success response
				// we are generating a fake response with the success data and calling the http client after hook fn with it
				await sdk.httpClient.hooks.afterRequest(
					{} as any,
					new Response(JSON.stringify(e.detail))
				);
				if (onSuccess) {
					onSuccess(e);
				}
			},
			[onSuccess]
		);

		useEffect(() => {
			const ele = innerRef;
			ele?.addEventListener('success', handleSuccess);
			if (onError) ele?.addEventListener('error', onError);
			if (onNext) ele?.addEventListener('next', onNext);

			return () => {
				if (onError) ele?.removeEventListener('error', onError);
				if (onNext) ele?.removeEventListener('next', onNext);

				ele?.removeEventListener('success', handleSuccess);
			};
		}, [innerRef, onError, handleSuccess]);

		useEffect(() => {
			if (innerRef) {
				innerRef.errorTransformer = errorTransformer;
			}
		}, [innerRef, errorTransformer]);

		return (
			/**
			 * in order to avoid redundant remounting of the WC, we are wrapping it with a form element
			 * this workaround is done in order to support webauthn passkeys
			 * it can be removed once this issue will be solved
			 * https://bugs.chromium.org/p/chromium/issues/detail?id=1404106#c2
			 */
			<form>
				<Suspense fallback={null}>
					<DescopeWC
						projectId={projectId}
						flowId={flowId}
						baseUrl={baseUrl}
						innerRef={setInnerRef}
						tenant={tenant}
						theme={theme}
						locale={locale}
						debug={debug}
						telemetryKey={telemetryKey}
						redirectUrl={redirectUrl}
						autoFocus={autoFocus}
					/>
				</Suspense>
			</form>
		);
	}
);

export default Descope;
