/* eslint-disable import/prefer-default-export */
import { getSessionToken } from '../../src';

// In this sample app, we just call an external public API
// You will probably want to replace it with your backend URL
const apiUrl = 'https://uselessfacts.jsph.pl/random.json?language=en';

// This is an example for using ,getSessionToken, in utility function
// This is useful to pass session token to your backend
// Note: Descope backend SDKs support extracting session token from the Authorization header
export const fetchData = async () => {
	const sessionToken = getSessionToken();
	const res = await fetch(apiUrl, {
		headers: {
			Authorization: `Bearer ${sessionToken}`
		}
	});
	const data = await res.json();
	return data?.text;
};
