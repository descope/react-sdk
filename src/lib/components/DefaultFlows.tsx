import '@descope/web-component';
import React from 'react';
import { DefaultFlowProps } from '../types';
import Descope from './Descope';

export const SignInFlow = (props: DefaultFlowProps) => (
	<Descope {...props} flowId="sign-in" />
);

export const SignUpFlow = (props: DefaultFlowProps) => (
	<Descope {...props} flowId="sign-up" />
);

export const SignUpOrInFlow = (props: DefaultFlowProps) => (
	<Descope {...props} flowId="sign-up-or-in" />
);
