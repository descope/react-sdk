import { useMemo } from 'react';
import createSdk from '../../sdk';
import { baseHeaders } from '../../constants';

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
	}, [projectId, baseUrl]);
