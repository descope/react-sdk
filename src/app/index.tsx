import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '../lib';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
	<AuthProvider projectId="<project-id>">
		<App flowId="<flow-id>" />
	</AuthProvider>
);
