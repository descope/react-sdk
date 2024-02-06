import React from 'react';
import { Link } from 'react-router-dom';
import UserDetails from './UserDetails';

const Home = () => {
	return (
		<div>
			<h1>App Router Home</h1>
			<UserDetails />
			<p>
				Navigate to <Link to="/login">Login</Link>
			</p>
		</div>
	);
};

export default Home;
