import eslintPluginAstro from 'eslint-plugin-astro'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default [
	...tseslint.config(eslint.configs.recommended, tseslint.configs.recommended),
	...eslintPluginAstro.configs.recommended,
	globalIgnores(['dist', '.astro']),
	{
		rules: {}
	}
]
