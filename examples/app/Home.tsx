import type { UserResponse } from '@descope/web-js-sdk';
import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
	getJwtRoles,
	useDescope,
	useSession,
	useUser,
	UserManagement
} from '../../src';

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
					borderBottom: '1px solid gray',
					display: 'flex',
					justifyContent: 'space-between'
				}}
			>
				<div>
					<p>
						User:{' '}
						<span style={{ fontWeight: 'bold' }}>
							{getUserDisplayName(user)}
						</span>
					</p>
					<p>
						{' '}
						Roles:{' '}
						<span style={{ fontWeight: 'bold' }}>{roles || 'No Roles'}</span>
					</p>
				</div>

				<div>
					<p>
						<button
							type="button"
							id="logout-button"
							onClick={onLogout}
							style={{
								display: 'block',
								margin: 'auto',
								padding: 5
							}}
						>
							Logout
						</button>
					</p>
					<p>
						{process.env.DESCOPE_STEP_UP_FLOW_ID && (
							<Link id="step-up-button" to="/step-up">
								Step Up
							</Link>
						)}
					</p>
				</div>
			</header>
			<h2>Home</h2>
			<UserManagement tenant={process.env.DESCOPE_TENANT} />
		</>
	);
};

export default Home;
