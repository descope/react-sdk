import { useMemo } from 'react';
import createSdk from '../../sdk';

declare const BUILD_VERSION: string;

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
			baseHeaders: {
				'x-descope-sdk-name': 'react',
				'x-descope-sdk-version': BUILD_VERSION
			},
			persistToken: true,
			autoRefresh: true
		});
	}, [projectId, baseUrl]);
