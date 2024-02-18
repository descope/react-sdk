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
	// eslint-disable-next-line no-console
	console.log('hey');
	return {
		default: ({ projectId, baseUrl, innerRef, tenant, theme, debug }) => (
			<descope-user-management-widget
				project-id={projectId}
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
	({ logger, tenant, theme, debug }, ref) => {
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
