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
const sourceExtensions = ['.ts', '.tsx'] as const

interface PackageEntry {
  input: string
  jsOutput: string
  dtsOutput: string
}

const getExportTarget = (exportValue: unknown): string | undefined => {
  if (typeof exportValue === 'string') {
    return exportValue
  }

  if (!exportValue || typeof exportValue !== 'object') {
    return undefined
  }

  const conditionMap = exportValue as Record<string, unknown>
  const target = conditionMap.import ?? conditionMap.default

  return typeof target === 'string' ? target : undefined
}

const getSourceInput = (
  packageDir: string,
  outputTarget: string
): string | undefined => {
  const normalizedTarget = outputTarget.replace(/^\.\//, '')

  if (
    !normalizedTarget.startsWith('dist/') ||
    !normalizedTarget.endsWith('.js')
  ) {
    return undefined
  }

  const sourceStem = normalizedTarget
    .replace(/^dist\//, 'src/')
    .replace(/\.js$/, '')

  return sourceExtensions
    .map((extension) => path.join(packageDir, `${sourceStem}${extension}`))
    .find((sourcePath) => fs.existsSync(sourcePath))
}

const getPackageEntries = (packageDir: string): PackageEntry[] => {
  const packageJsonPath = path.join(packageDir, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as {
    exports?: Record<string, unknown>
  }
  const exportValues = packageJson.exports
    ? Object.values(packageJson.exports)
    : [{ import: './dist/index.js' }]
  const seenOutputs = new Set<string>()

  return exportValues.flatMap((exportValue) => {
    const outputTarget = getExportTarget(exportValue)

    if (!outputTarget) {
      return []
    }

    const normalizedOutput = outputTarget.replace(/^\.\//, '')

    if (seenOutputs.has(normalizedOutput)) {
      return []
    }

    const input = getSourceInput(packageDir, outputTarget)

    if (!input) {
      throw new Error(
        `Missing source entry for ${path.join(packageDir, normalizedOutput)}`
      )
    }

    seenOutputs.add(normalizedOutput)

    return [
      {
        input,
        jsOutput: path.join(packageDir, normalizedOutput),
        dtsOutput: path.join(
          packageDir,
          normalizedOutput.replace(/\.js$/, '.d.ts')
        ),
      },
    ]
  })
}

const configs = packageDirs.flatMap((packageName): RollupOptions[] => {
  const packageDir = path.join(packagesDir, packageName)
  const entries = getPackageEntries(packageDir)
  const isEmptyOptionsDispatcherLog = (code?: string, message?: string) =>
    packageName === 'options-dispatcher' &&
    (code === 'EMPTY_BUNDLE' ||
      code === 'EMPTY_CHUNK' ||
      message?.includes('Generated an empty chunk'))
  const onLog: RollupOptions['onLog'] = (level, log, handler) => {
    if (isEmptyOptionsDispatcherLog(log.code, log.message)) {
      return
    }

    handler(level, log)
  }
  const onwarn: RollupOptions['onwarn'] = (warning, warn) => {
    if (isEmptyOptionsDispatcherLog(warning.code, warning.message)) {
      return
    }

    warn(warning)
  }

  return entries.flatMap((entry): RollupOptions[] => [
    {
      input: entry.input,
      onLog,
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
        file: entry.jsOutput,
        format: 'esm',
        sourcemap: true,
      },
    },
    {
      input: entry.input,
      onLog,
      onwarn,
      external: isExternal,
      plugins: [dts({ tsconfig })],
      output: {
        file: entry.dtsOutput,
        format: 'esm',
      },
    },
  ])
})

export default defineConfig(configs)
