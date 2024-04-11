// eslint-disable-next-line import/no-extraneous-dependencies
export { default as AuthProvider } from './components/AuthProvider';
export {
	SignInFlow,
	SignUpFlow,
	SignUpOrInFlow
} from './components/DefaultFlows';
export { default as Descope } from './components/Descope';
export { default as UserManagement } from './components/UserManagement';
export { default as RoleManagement } from './components/RoleManagement';
export { default as AccessKeyManagement } from './components/AccessKeyManagement';
export { default as AuditManagement } from './components/AuditManagement';
export { default as useDescope } from './hooks/useDescope';
export { default as useSession } from './hooks/useSession';
export { default as useUser } from './hooks/useUser';
export {
	getJwtPermissions,
	getJwtRoles,
	refresh,
	getRefreshToken,
	getSessionToken
} from './sdk';

// Export ref to baseHeaders so it can be overridden
export { baseHeaders } from './constants';

export type { ILogger } from './types';
