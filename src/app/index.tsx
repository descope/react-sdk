import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../lib';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
	<BrowserRouter>
		<AuthProvider
			projectId={process.env.DESCOPE_PROJECT_ID}
			baseUrl={process.env.DESCOPE_BASE_URL}
		>
			<App />
		</AuthProvider>
	</BrowserRouter>
);
