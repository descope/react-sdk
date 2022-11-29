import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib';

const getUserDisplayName = (user) => user?.name || user?.externalIds?.[0] || '';

const Home = () => {
	const { authenticated, user, logout } = useAuth();
	const onLogout = useCallback(() => {
		logout();
	}, [logout]);
	return (
		<>
			<h2>Home</h2>
			{!authenticated && (
				<Link id="login-button" to="/login">
					Login
				</Link>
			)}
			{authenticated && (
				<>
					<div className="username"> Hello {getUserDisplayName(user)}</div>
					<button
						type="button"
						id="logout-button"
						onClick={onLogout}
						style={{
							display: 'block',
							margin: 'auto',
							background: 'none',
							border: 'none',
							color: 'blue',
							padding: 5
						}}
					>
						Logout
					</button>
				</>
			)}
		</>
	);
};

export default Home;
