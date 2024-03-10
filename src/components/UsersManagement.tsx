import React, {
	lazy,
	Suspense,
	useEffect,
	useImperativeHandle,
	useState
} from 'react';
import Context from '../hooks/Context';
import { UserManagementProps } from '../types';

// web-component code uses browser API, but can be used in SSR apps, hence the lazy loading
const UserManagementWC = lazy(async () => {
	await import('@descope/user-management-widget');

	return {
		default: ({
			projectId,
			baseUrl,
			innerRef,
			tenant,
			widgetId,
			theme,
			debug
		}) => (
			<descope-user-management-widget
				project-id={projectId}
				widget-id={widgetId}
				base-url={baseUrl}
				theme={theme}
				tenant={tenant}
				debug={debug}
				ref={innerRef}
			/>
		)
	};
});

const UserManagement = React.forwardRef<HTMLElement, UserManagementProps>(
	({ logger, tenant, theme, debug, widgetId }, ref) => {
		const [innerRef, setInnerRef] = useState(null);

		useImperativeHandle(ref, () => innerRef);

		const { projectId, baseUrl } = React.useContext(Context);

		useEffect(() => {
			if (innerRef && logger) {
				innerRef.logger = logger;
			}
		}, [innerRef, logger]);

		return (
			<Suspense fallback={null}>
				<UserManagementWC
					projectId={projectId}
					widgetId={widgetId}
					baseUrl={baseUrl}
					innerRef={setInnerRef}
					tenant={tenant}
					theme={theme}
					debug={debug}
				/>
			</Suspense>
		);
	}
);

export default UserManagement;
