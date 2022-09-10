import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '../../dist';

import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
	<AuthProvider
		projectId="P2EUYZPY0NycesHMqt7QU5onE6V4"
		baseUrl="http://localhost:8000"
	>
		<App flowId="otp.json" />
	</AuthProvider>
);
