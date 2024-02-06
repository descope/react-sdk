import React from 'react';
import { useCallback, useEffect } from 'react';
import { useDescope, useSession, useUser } from '../../src';

const UserDetails = () => {
	const { isAuthenticated, isSessionLoading } = useSession();
	const { user } = useUser();
	const sdk = useDescope();

	console.log('UserDetails render', {
		isAuthenticated,
		isSessionLoading
	});
	useEffect(() => {
		console.log('## sdk?', sdk ? 'y' : 'n');
		sdk.onSessionTokenChange((curr) => {
			console.log('## onSessionTokenChange', curr ? 'curr-y' : 'curr-n');
		});
	}, []);

	const onLogout = useCallback(async () => {
		await sdk.logout();
	}, [sdk]);

	// asaf TODO why isSessionLoading is not changing to false after login?
	if (isSessionLoading) return <div>Loading...</div>;

	return (
		<div>
			<h4>User Details</h4>
			{!isAuthenticated && <p>Not authenticated</p>}
			{isAuthenticated && (
				<div>
					<p>Authenticated, hey {user?.name || user?.email}</p>
					<button onClick={onLogout}>Logout</button>
				</div>
			)}
		</div>
	);
};

export default UserDetails;
