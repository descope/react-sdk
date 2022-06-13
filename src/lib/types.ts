import React, { DOMAttributes } from 'react';
import DescopeWc from '@descope/web-js-sdk';

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
