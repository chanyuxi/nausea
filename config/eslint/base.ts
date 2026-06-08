import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** Shared ESLint rules for browser app source files. */
export const baseConfig = defineConfig(
  globalIgnores([
    '**/dist/**',
    '**/coverage/**',
    'node_modules/**',
    '.husky/_/**',
    '.vscode/**',
    'package-lock.json',
    '**/*.tsbuildinfo',
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    ...reactHooks.configs.flat.recommended,
  },
  {
    files: ['**/*.{jsx,tsx}'],
    ...reactRefresh.configs.vite,
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
  prettierPluginRecommended
)
