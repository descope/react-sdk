import { useMemo } from 'react';
import createSdk from '../../sdk';

declare const BUILD_VERSION: string;

type Config = {
	projectId: string;
	baseUrl?: string;
	sessionTokenViaCookie?: boolean;
};

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
			hooks: {
				beforeRequest: (config) => {
					const conf = config;
					conf.headers = {
						...conf.headers,
						'x-descope-sdk-name': 'react',
						'x-descope-sdk-version': BUILD_VERSION
					};
					return conf;
				}
			},
			persistToken: true,
			autoRefresh: true
		});
	}, [projectId, baseUrl]);
