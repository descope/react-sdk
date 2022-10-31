import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import autoExternal from 'rollup-plugin-auto-external';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

const packageJson = require('./package.json');

export default [
	{
		input: 'src/lib/index.ts',
		output: { dir: 'dist', format: 'esm' },
		plugins: [
			del({ targets: 'dist' }),
			typescript({
				rootDir: './src/lib'
			}),
			autoExternal(),
			terser()
		]
	},
	{
		input: './dist/dts/index.d.ts',
		output: [{ file: packageJson.types, format: 'esm' }],
		plugins: [dts(), del({ hook: 'buildEnd', targets: ['./dist/dts'] })]
	}
];
