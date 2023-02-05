import DescopeWc from '@descope/web-component';
import type { UserResponse } from '@descope/web-js-sdk';
import React, { DOMAttributes } from 'react';
import createSdk from './sdk';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			['descope-wc']: DescopeCustomElement;
		}
	}
}

export type Sdk = ReturnType<typeof createSdk>;

export type CustomEvents<K extends string> = {
	[key in K]: (event: CustomEvent) => void;
};

export type CustomElement<T, K extends string = ''> = Partial<
	T &
		DOMAttributes<T> & {
			children: React.ReactChild;
			ref: React.Ref<HTMLElement>;
		} & CustomEvents<`on${K}`>
>;

export type DescopeCustomElement = CustomElement<
	DescopeWc,
	'success' | 'error'
>;

export interface IAuth {
	logoutAll: Sdk['logoutAll'];
	logout: Sdk['logout'];
}

export type User = UserResponse;

export interface IContext {
	fetchUser: () => void;
	user: User;
	isUserLoading: boolean;
	fetchSession: () => void;
	session: string;
	isSessionLoading: boolean;
	projectId: string;
	baseUrl?: string;
	sdk?: Sdk;
	setUser: React.Dispatch<React.SetStateAction<User>>;
	setSession: React.Dispatch<React.SetStateAction<string>>;
	logout: Sdk['logout'];
	logoutAll: Sdk['logoutAll'];
}

export type DescopeTheme = 'light' | 'dark';

export interface DescopeProps {
	flowId: string;
	onSuccess?: DescopeCustomElement['onsuccess'];
	onError?: DescopeCustomElement['onerror'];
	tenant?: string;
	// If theme is not provided - the OS theme will be used
	theme?: DescopeTheme;
	debug?: boolean;
	telemetryKey?: string;
}

export type DefaultFlowProps = Omit<DescopeProps, 'flowId'>;
