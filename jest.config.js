export default {
	// Automatically clear mock calls, instances, contexts and results before every test
	clearMocks: true,

	collectCoverage: true,
	coverageDirectory: 'coverage',
	collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],

	// A set of global variables that need to be available in all test environments
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.json'
		},
		BUILD_VERSION: 'one.two.three'
	},

	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	moduleDirectories: ['node_modules', 'src'],
	setupFilesAfterEnv: ['<rootDir>/testUtils/jest-setup.js'],

	testTimeout: 5000,

	transform: {
		'\\.[jt]sx?$': 'babel-jest'
	},
	roots: ['src', 'test']
};
