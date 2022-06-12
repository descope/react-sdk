const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
	// Automatically clear mock calls, instances, contexts and results before every test
	clearMocks: true,

	collectCoverage: true,
	coverageDirectory: 'coverage',
	collectCoverageFrom: ['src/lib/*.{js,jsx,ts,tsx}'],

	// A set of global variables that need to be available in all test environments
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.json'
		}
	},

	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	moduleDirectories: ['node_modules', 'src'],
	setupFilesAfterEnv: ['<rootDir>/testUtils/jest-setup.js'],

	testTimeout: 2000,

	transform: {
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			__dirname + '/testUtils/fileTransformer.js',
		"\\.[jt]sx?$": "babel-jest"

	},
	"roots": [
		"src",
		"test"
	]
};