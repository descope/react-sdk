// eslint-disable-next-line import/no-extraneous-dependencies
export { getSessionToken } from '@descope/web-js-sdk';
export { default as AuthProvider } from './components/AuthProvider';
export {
	SignInFlow,
	SignUpFlow,
	SignUpOrInFlow
} from './components/DefaultFlows';
export { default as Descope } from './components/Descope';
export { default as useAuth } from './hooks/useAuth';
