import type { UserResponse } from '@descope/web-js-sdk';
import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getJwtRoles, useDescope, useSession, useUser } from '../../src';

const getUserDisplayName = (user?: UserResponse) =>
	user?.name || user?.loginIds?.[0] || '';

const Home = () => {
	// useSession retrieves authentication state, session loading status, and session token
	const { sessionToken } = useSession();
	// useUser retrieves the logged in user information
	const { user, isUserLoading } = useUser();
	// useDescope retrieves Descope SDK for further operations related to authentication
	// such as logout
	const sdk = useDescope();

	const selectTenant = useCallback(
		(tenantId) => {
			sdk.selectTenant(tenantId);
		},
		[sdk]
	);

	const selectedTenant = useMemo(() => {
		const decoded = jwtDecode(sessionToken);
		// The selected tenant is stored in the "dct" claim
		// @ts-ignore-next-line
		return decoded?.dct || '';
	}, [sessionToken]);

	// const currentTenant = sdk.Jwt
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
			<h2>Home</h2>
			<p>
				Roles: <span style={{ fontWeight: 'bold' }}>{roles || 'No Roles'}</span>
			</p>
			{!isUserLoading && (
				<div>
					<label htmlFor="tenants-select">
						{' '}
						Current Tenant:
						<select
							name="tenants"
							id="tenants-select"
							value={selectedTenant}
							onChange={(e) => selectTenant(e.target.value)}
						>
							<option value="">
								{selectedTenant ? 'Remove tenant selection' : 'Select Tenant'}
							</option>
							{user?.userTenants.map((tenant) => (
								<option key={tenant.tenantId} value={tenant.tenantId}>
									{tenant.tenantName}
								</option>
							))}
						</select>
					</label>
					<p>
						* The session token will be updated with the selected tenant under
						the &quot;dct&quot; claim
					</p>
				</div>
			)}
		</>
	);
};

export default Home;
