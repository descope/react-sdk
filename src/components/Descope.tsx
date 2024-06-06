import React, {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState
} from 'react';
import { baseHeaders } from '../constants';
import Context from '../hooks/Context';
import { DescopeProps } from '../types';
import { getGlobalSdk } from '../sdk';

// web-component code uses browser API, but can be used in SSR apps, hence the lazy loading
const DescopeWC = lazy(async () => {
	const module = await import('@descope/web-component');
	module.default.sdkConfigOverrides = {
		// Overrides the web-component's base headers to indicate usage via the React SDK
		baseHeaders,
		// Disables token persistence within the web-component to delegate token management
		// to the global SDK hooks. This ensures token handling aligns with the SDK's configuration,
		// and web-component requests leverage the global SDK's beforeRequest hooks for consistency
		persistTokens: false,
		hooks: {
			get beforeRequest() {
				// Retrieves the beforeRequest hook from the global SDK, which is initialized
				// within the AuthProvider using the desired configuration. This approach ensures
				// the web-component utilizes the same beforeRequest hooks as the global SDK
				return getGlobalSdk().httpClient.hooks.beforeRequest;
			},
			set beforeRequest(_) {
				// The empty setter prevents runtime errors when attempts are made to assign a value to 'beforeRequest'.
				// JavaScript objects default to having both getters and setters
			}
		}
	};

	return {
		default: ({
			projectId,
			flowId,
			baseUrl,
			baseStaticUrl,
			innerRef,
			tenant,
			theme,
			locale,
			debug,
			redirectUrl,
			client,
			form,
			autoFocus,
			validateOnBlur
		}) => (
			<descope-wc
				project-id={projectId}
				flow-id={flowId}
				base-url={baseUrl}
				base-static-url={baseStaticUrl}
				ref={innerRef}
				tenant={tenant}
				theme={theme}
				locale={locale}
				debug={debug}
				client={client}
				form={form}
				redirect-url={redirectUrl}
				auto-focus={autoFocus}
				validate-on-blur={validateOnBlur}
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
			onReady,
			logger,
			tenant,
			theme,
			locale,
			debug,
			client,
			form,
			telemetryKey,
			redirectUrl,
			autoFocus,
			validateOnBlur,
			errorTransformer
		},
		ref
	) => {
		const [innerRef, setInnerRef] = useState(null);

		useImperativeHandle(ref, () => innerRef);

		const {
			projectId,
			baseUrl,
			baseStaticUrl,
			storeLastAuthenticatedUser,
			sdk
		} = React.useContext(Context);

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
			if (onReady) ele?.addEventListener('ready', onReady);

			return () => {
				if (onError) ele?.removeEventListener('error', onError);
				if (onReady) ele?.removeEventListener('ready', onReady);

				ele?.removeEventListener('success', handleSuccess);
			};
		}, [innerRef, onError, handleSuccess]);

		// Success event
		useEffect(() => {
			const ele = innerRef;
			ele?.addEventListener('success', handleSuccess);
			return () => {
				ele?.removeEventListener('success', handleSuccess);
			};
		}, [innerRef, handleSuccess]);

		// Error event
		useEffect(() => {
			const ele = innerRef;
			if (onError) ele?.addEventListener('error', onError);

			return () => {
				if (onError) ele?.removeEventListener('error', onError);
			};
		}, [innerRef, onError]);

		// Ready event
		useEffect(() => {
			const ele = innerRef;
			if (onReady) ele?.addEventListener('ready', onReady);

			return () => {
				if (onReady) ele?.removeEventListener('error', onReady);
			};
		}, [innerRef, onReady]);

		useEffect(() => {
			if (innerRef) {
				innerRef.errorTransformer = errorTransformer;
			}
		}, [innerRef, errorTransformer]);

		useEffect(() => {
			if (innerRef && logger) {
				innerRef.logger = logger;
			}
		}, [innerRef, logger]);

		const { form: stringifiedForm, client: stringifiedClient } = useMemo(
			() => ({
				form: JSON.stringify(form || {}),
				client: JSON.stringify(client || {})
			}),
			[form, client]
		);

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
						baseStaticUrl={baseStaticUrl}
						innerRef={setInnerRef}
						tenant={tenant}
						theme={theme}
						locale={locale}
						debug={debug}
						form={stringifiedForm}
						client={stringifiedClient}
						telemetryKey={telemetryKey}
						redirectUrl={redirectUrl}
						autoFocus={autoFocus}
						validateOnBlur={validateOnBlur}
						storeLastAuthenticatedUser={storeLastAuthenticatedUser}
					/>
				</Suspense>
			</form>
		);
	}
);

export default Descope;
