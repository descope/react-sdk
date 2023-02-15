/**
 * Wrap a function with a validation that it exists
 * @param fn The function to wrap with the validation
 * @throws if function does not exist, an error with the relevant message will be thrown
 */
export const withValidation =
	<T extends Array<any>, U>(fn: (...args: T) => U) =>
	(...args: T): U => {
		if (!fn) {
			throw Error(
				`You can only use this function after sdk initialization. Make sure to supply 'projectId' to <AuthProvider /> component`
			);
		}
		return fn(...args);
	};

export const wrapInTry =
	<T extends Array<any>, U>(fn: (...args: T) => U) =>
	(...args: T): U => {
		let res: U;
		try {
			res = fn(...args);
		} catch (err) {
			console.error(err); // eslint-disable-line no-console
		}
		return res;
	};
