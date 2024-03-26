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
>;

export default ({
	projectId,
	baseUrl,
	persistTokens,
	sessionTokenViaCookie,
	storeLastAuthenticatedUser
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
			autoRefresh: true
		});
	}, [projectId, baseUrl, sessionTokenViaCookie]);
