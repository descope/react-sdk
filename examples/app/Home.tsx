import type { UserResponse } from '@descope/web-js-sdk';
import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getJwtRoles, useDescope, useSession, useUser } from '../../src';

const getUserDisplayName = (user?: UserResponse) =>
	user?.name || user?.loginIds?.[0] || '';

const Home = () => {
	// useSession retrieves authentication state, session loading status, and session token
	const { sessionToken } = useSession();
	// useUser retrieves the logged in user information
	const { user } = useUser();
	// useDescope retrieves Descope SDK for further operations related to authentication
	// such as logout
	const sdk = useDescope();

	const onLogout = useCallback(() => {
		sdk.logout();
	}, [sdk]);

	const roles = useMemo(
		() => sessionToken && (getJwtRoles(sessionToken) || []).join(', '),
		[sessionToken]
	);

	return (
		<>
			<header
				style={{
					borderBottom: '4px solid lightgray',
					display: 'flex',
					justifyContent: 'space-between'
				}}
			>
				<div>
					<p>
						<a href="/user-management">Manage Users</a>
					</p>
					<p>
						{process.env.DESCOPE_STEP_UP_FLOW_ID && (
							<Link id="step-up-button" to="/step-up">
								Step Up
							</Link>
						)}
					</p>
				</div>

				<div>
					<p>
						User:{' '}
						<span style={{ fontWeight: 'bold' }}>
							{getUserDisplayName(user)}
						</span>
					</p>
					<p>
						<button
							type="button"
							id="logout-button"
							onClick={onLogout}
							style={{
								display: 'block',
								marginLeft: 'auto',
								padding: 5
							}}
						>
							Logout
						</button>
					</p>
				</div>
			</header>
			<h2>Descope Demo App</h2>
			<div
				style={{
					margin: '0 auto',
					textAlign: 'center'
				}}
			>
				<h1>Dashboard</h1>
			</div>
		</>
	);
};

export default Home;
