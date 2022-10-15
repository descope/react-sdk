import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '../lib';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
	<AuthProvider
		projectId="P2FxzK5spgYnH4HUWtBzFfB72V51"
	>
		<App flowId="sign-up-or-in" />
	</AuthProvider>
);
