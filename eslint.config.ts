import { defineConfig } from 'eslint/config'

import {
  baseConfig,
  importSortingConfig,
  jsoncConfig,
} from './config/eslint/index.ts'

export default defineConfig(baseConfig, importSortingConfig, jsoncConfig)
