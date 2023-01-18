import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useSession } from '../lib';
import { fetchData } from './api';

const getUserDisplayName = (user) => user?.name || user?.externalIds?.[0] || '';

const Home = () => {
	const { useUser, logout } = useAuth();
	const { isAuthenticated, isSessionLoading } = useSession();
	const { user } = useUser();

	const onLogout = useCallback(() => {
		logout();
	}, [logout]);

	const onFetch = useCallback(async () => {
		const data = await fetchData();
		alert(data);
	}, []);

	if (isSessionLoading) return <div>Loading...</div>;

	return (
		<>
			<h2>Home</h2>
			{!isAuthenticated && (
				<Link id="login-button" to="/login">
					Login
				</Link>
			)}
			{isAuthenticated && (
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
					<button
						type="button"
						id="fetch-button"
						onClick={onFetch}
						style={{
							display: 'block',
							margin: 'auto',
							background: 'none',
							border: 'none',
							color: 'blue',
							padding: 5
						}}
					>
						Fetch Fact
					</button>
				</>
			)}
		</>
	);
};

export default Home;
