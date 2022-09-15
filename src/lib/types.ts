import React, { DOMAttributes } from 'react';
import DescopeWc from '@descope/web-component';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			['descope-wc']: DescopeCustomElement;
		}
	}
}

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

export enum UserStatus {
	enabled = 'enabled',
	disabled = 'disabled',
	invited = 'invited',
	unknown = 'unknown'
}

export interface IExternalID {
	id: string;
	type?: string;
}

export interface User {
	externalIDs?: IExternalID[];
	displayName?: string;
	project?: string;
	logoutTime?: number;
	createTime?: number;
	email?: string;
	phoneNumber?: string;
	status?: UserStatus;
	verifiedEmail?: boolean;
	verifiedPhone?: boolean;
	tenants?: string[];
}

export interface IAuthContext {
	projectId: string;
	baseUrl?: string;
	authenticated: boolean;
  user?: User;
	sessionToken?: string;
	setUser: React.Dispatch<React.SetStateAction<User>>;
	setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
	setSessionToken: React.Dispatch<React.SetStateAction<string>>;
}