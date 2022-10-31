import nodeResolve from '@rollup/plugin-node-resolve';
import html from '@open-wc/rollup-plugin-html';
import browsersync from 'rollup-plugin-browsersync';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import del from 'rollup-plugin-delete';

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
		nodeResolve(),
		html(),
		browsersync({ server: 'build' })
	]
};
