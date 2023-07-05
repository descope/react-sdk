import type { AutoFocusOptions, ThemeOptions } from '@descope/web-component';
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

export type User = UserResponse;

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

export interface IContext {
	fetchUser: () => void;
	user: User;
	isUserLoading: boolean;
	fetchSession: () => void;
	session: string;
	isSessionLoading: boolean;
	isSessionFetched: boolean;
	projectId: string;
	baseUrl?: string;
	sdk?: Sdk;
	setUser: React.Dispatch<React.SetStateAction<User>>;
	setSession: React.Dispatch<React.SetStateAction<string>>;
}

export interface DescopeProps {
	flowId: string;
	onSuccess?: DescopeCustomElement['onsuccess'];
	onError?: DescopeCustomElement['onerror'];
	tenant?: string;
	// If theme is not provided - the OS theme will be used
	theme?: ThemeOptions;
	autoFocus?: AutoFocusOptions;
	debug?: boolean;
	telemetryKey?: string;
	redirectUrl?: string;
	errorTransformer?: (error: { text: string; type: string }) => string;
}

export type DefaultFlowProps = Omit<DescopeProps, 'flowId'>;
