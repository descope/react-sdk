import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import autoExternal from 'rollup-plugin-auto-external';
import define from 'rollup-plugin-define';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';

const packageJson = require('./package.json');

export default [
	{
		input: 'src/lib/index.ts',
		output: {
			file: packageJson.main,
			sourcemap: true,
			format: 'cjs'
		},
		plugins: [
			define({
				replacements: {
					BUILD_VERSION: JSON.stringify(require('./package.json').version)
				}
			}),
			typescript({
				tsconfig: './tsconfig.json'
			}),
			autoExternal(),
			terser()
		]
	},
	{
		input: 'src/lib/index.ts',
		output: {
			file: packageJson.module,
			sourcemap: true,
			format: 'esm'
		},
		plugins: [
			define({
				replacements: {
					BUILD_VERSION: JSON.stringify(require('./package.json').version)
				}
			}),
			typescript({
				tsconfig: './tsconfig.json'
			}),
			autoExternal(),
			terser()
		]
	},
	{
		input: './dist/src/lib/index.d.ts',
		output: [{ file: packageJson.types, format: 'esm' }],
		plugins: [
			dts(),
			del({
				hook: 'buildEnd',
				targets: [
					'./dist/test',
					'./dist/src',
					'./dist/cjs/!(index.cjs.*|package.json)'
				]
			}),
			cjsPackage()
		]
	}
];

function cjsPackage() {
	return {
		name: 'cjsPackage',
		buildEnd: () => {
			fs.writeFileSync(
				'./dist/cjs/package.json',
				JSON.stringify({ type: 'commonjs' })
			);
		}
	};
}
