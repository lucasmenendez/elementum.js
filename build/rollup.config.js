import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from '../package.json';

export default [
	{
		input: 'src/component.js',
		output: {
			name: 'component',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			resolve(),
			commonjs()
		]
	},
	{
		input: 'src/component.js',
		external: ['ms'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];