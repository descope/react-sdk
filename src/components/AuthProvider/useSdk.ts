import { useMemo } from 'react';
import { baseHeaders } from '../../constants';
import createSdk from '../../sdk';

type Config = Pick<
	Parameters<typeof createSdk>[0],
	| 'projectId'
	| 'baseUrl'
	| 'persistTokens'
	| 'sessionTokenViaCookie'
	| 'storeLastAuthenticatedUser'
	| 'keepLastAuthenticatedUserAfterLogout'
>;

export default ({
	projectId,
	baseUrl,
	persistTokens,
	sessionTokenViaCookie,
	storeLastAuthenticatedUser,
	keepLastAuthenticatedUserAfterLogout
}: Config): ReturnType<typeof createSdk> =>
	useMemo(() => {
		if (!projectId) {
			return undefined;
		}
		return createSdk({
			projectId,
			baseUrl,
			sessionTokenViaCookie,
			baseHeaders,
			persistTokens,
			storeLastAuthenticatedUser,
			keepLastAuthenticatedUserAfterLogout,
			autoRefresh: true
		});
	}, [projectId, baseUrl, sessionTokenViaCookie]);
