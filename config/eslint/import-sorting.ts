import type { ESLint } from 'eslint'
import { defineConfig } from 'eslint/config'
import importXPlugin from 'eslint-plugin-import-x'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const importXFlatPlugin = importXPlugin as unknown as ESLint.Plugin

/** Import ordering and duplicate import rules shared by all linted files. */
export const importSortingConfig = defineConfig(
  {
    plugins: {
      'import-x': importXFlatPlugin,
    },
    rules: {
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': 'error',
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  }
)
