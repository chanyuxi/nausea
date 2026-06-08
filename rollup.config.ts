import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import typescript from '@rollup/plugin-typescript'
import type { RollupOptions } from 'rollup'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const packagesDir = path.join(rootDir, 'packages')
const tsconfig = path.join(rootDir, 'tsconfig.build.json')

const packageDirs = fs
  .readdirSync(packagesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)

const isExternal = (id: string) => !id.startsWith('.') && !path.isAbsolute(id)

const configs = packageDirs.flatMap((packageName): RollupOptions[] => {
  const packageDir = path.join(packagesDir, packageName)
  const input = path.join(packageDir, 'src/index.ts')
  const onwarn: RollupOptions['onwarn'] = (warning, warn) => {
    if (
      packageName === 'options-dispatcher' &&
      warning.code === 'EMPTY_BUNDLE'
    ) {
      return
    }

    warn(warning)
  }

  return [
    {
      input,
      onwarn,
      external: isExternal,
      plugins: [
        typescript({
          tsconfig,
          declaration: false,
          declarationMap: false,
        }),
      ],
      output: {
        file: path.join(packageDir, 'dist/index.js'),
        format: 'esm',
        sourcemap: true,
      },
    },
    {
      input,
      onwarn,
      external: isExternal,
      plugins: [dts({ tsconfig })],
      output: {
        file: path.join(packageDir, 'dist/index.d.ts'),
        format: 'esm',
      },
    },
  ]
})

export default defineConfig(configs)
