import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../lib';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

window.localStorage.setItem(
	'base.content.url',
	'http://static.sandbox.descope.com.s3-website.eu-central-1.amazonaws.com/pages'
);

root.render(
	<AuthProvider
		projectId="P2GMoq7QnPF2npaW0dUuTglLSeQ2"
		baseUrl="https://api.sandbox.descope.com"
	>
		<BrowserRouter>
			<App flowId="sign-up-or-in" />
		</BrowserRouter>
	</AuthProvider>
);
