// eslint-disable-next-line import/no-extraneous-dependencies
export { default as AuthProvider } from './components/AuthProvider';
export {
	SignInFlow,
	SignUpFlow,
	SignUpOrInFlow
} from './components/DefaultFlows';
export { default as Descope } from './components/Descope';
export { default as useDescope } from './hooks/useDescope';
export {
	getSessionToken,
	getJwtPermissions,
	getJwtRoles,
	getRefreshToken
} from './sdk';
export { default as useAuth } from './hooks/useAuth';
export { default as useUser } from './hooks/useUser';
