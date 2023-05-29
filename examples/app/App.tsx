import React from 'react';
import Home from './Home';
import Login from './Login';
import { useSession } from '../../src';

const App = () => {
	const { isSessionLoading, isAuthenticated } = useSession();

	if (isSessionLoading) {
		return <div>Loading...</div>;
	}

	return <>{isAuthenticated ? <div>login</div> : <Home />}</>;
};

export default App;
