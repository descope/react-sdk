import React from 'react';
import { useSession } from '../../src';

const Home = () => {
	const { isSessionLoading } = useSession();

	if (isSessionLoading) return <div>Loading...</div>;
	return (
		<>
			<h2>Home</h2>
		</>
	);
};

export default Home;
