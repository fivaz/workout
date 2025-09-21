import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ ignores: ['dist', '.react-router'] },
	{
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{
					allowConstantExport: true,
					allowExportNames: ['meta', 'links', 'headers', 'loader', 'action'],
				},
			],
			'@typescript-eslint/consistent-type-imports': 'error',
			'@typescript-eslint/no-unused-vars': [
				'warn', // or 'error'
				{
					vars: 'all',              // check all variables
					args: 'after-used',       // check function arguments
					ignoreRestSiblings: true, // ignore rest siblings
					varsIgnorePattern: '^_',  // ignore vars starting with _
					argsIgnorePattern: '^_',  // ignore function args starting with _
				},
			],
		},
	},
);
