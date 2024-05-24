import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src';
import App from './App';

const root = document.getElementById('root');

render(
	<BrowserRouter>
		<AuthProvider
			projectId={process.env.DESCOPE_PROJECT_ID}
			baseUrl={process.env.DESCOPE_BASE_URL}
			baseStaticUrl={process.env.DESCOPE_BASE_STATIC_URL}
		>
			<App />
		</AuthProvider>
	</BrowserRouter>,
	root
);
