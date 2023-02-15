import { useMemo } from 'react';
import { baseHeaders } from '../../constants';
import createSdk from '../../sdk';

type Config = Pick<
	Parameters<typeof createSdk>[0],
	'projectId' | 'baseUrl' | 'sessionTokenViaCookie'
>;

export default ({
	projectId,
	baseUrl,
	sessionTokenViaCookie
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
			persistToken: true,
			autoRefresh: true
		});
	}, [projectId, baseUrl, sessionTokenViaCookie]);
