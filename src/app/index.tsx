import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '../lib';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
	<AuthProvider
		projectId="P2E9uVhDZvLQEVH9Ncau5DjCEDp4"
		baseUrl="http://localhost:8000"
	>
		<App />
	</AuthProvider>
);
