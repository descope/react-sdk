import React, {
	lazy,
	Suspense,
	useEffect,
	useImperativeHandle,
	useState
} from 'react';
import Context from '../hooks/Context';
import { UserProfileProps } from '../types';

// web-component code uses browser API, but can be used in SSR apps, hence the lazy loading
const UserProfileWC = lazy(async () => {
	await import('@descope/user-profile-widget');

	return {
		default: ({
			projectId,
			baseUrl,
			baseStaticUrl,
			innerRef,
			widgetId,
			theme,
			debug
		}) => (
			<descope-user-profile-widget
				project-id={projectId}
				widget-id={widgetId}
				base-url={baseUrl}
				base-static-url={baseStaticUrl}
				theme={theme}
				debug={debug}
				ref={innerRef}
			/>
		)
	};
});

const UserProfile = React.forwardRef<HTMLElement, UserProfileProps>(
	({ logger, theme, debug, widgetId, onLogout }, ref) => {
		const [innerRef, setInnerRef] = useState(null);

		useImperativeHandle(ref, () => innerRef);

		const { projectId, baseUrl, baseStaticUrl } = React.useContext(Context);

		useEffect(() => {
			if (innerRef && logger) {
				innerRef.logger = logger;
			}
		}, [innerRef, logger]);

		useEffect(() => {
			if (innerRef && onLogout) {
				innerRef.addEventListener('logout', onLogout);
				return () => innerRef.removeEventListener('logout', onLogout);
			}
			return undefined;
		}, [innerRef, onLogout]);

		return (
			<Suspense fallback={null}>
				<UserProfileWC
					projectId={projectId}
					widgetId={widgetId}
					baseUrl={baseUrl}
					baseStaticUrl={baseStaticUrl}
					innerRef={setInnerRef}
					theme={theme}
					debug={debug}
				/>
			</Suspense>
		);
	}
);

export default UserProfile;
