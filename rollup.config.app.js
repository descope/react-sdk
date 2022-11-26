import html from '@open-wc/rollup-plugin-html';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import browsersync from 'rollup-plugin-browsersync';
import del from 'rollup-plugin-delete';
import dotenv from 'rollup-plugin-dotenv';

export default {
	input: 'src/app/index.html',
	output: { dir: 'build', format: 'esm' },
	plugins: [
		del({ targets: 'build' }),
		typescript({
			declaration: false,
			declarationDir: 'build'
		}),
		commonjs(),
		replace({
			preventAssignment: true,
			'process.env.NODE_ENV': JSON.stringify('development')
		}),
		dotenv(),
		nodeResolve(),
		html(),
		browsersync({
			server: 'build',
			single: true // requires for routing
		})
	]
};
