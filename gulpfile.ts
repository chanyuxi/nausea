import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'

import type { TaskFunctionCallback } from 'gulp'
import { series, task } from 'gulp'

import { rimrafSync } from 'rimraf'
import { globSync } from 'glob'
import logger from 'gulplog'

import { rollup } from 'rollup'
import typescript from '@rollup/plugin-typescript'

const dirname = fileURLToPath(new URL('.', import.meta.url))

function dirnameResovle(...args: string[]) {
    return resolve(dirname, ...args)
}

function clean(cb: TaskFunctionCallback) {
    rimrafSync(dirnameResovle('dist'))
    cb()
}

function copyScssFiles(cb: TaskFunctionCallback) {
    const dir = dirnameResovle('dist/styles')
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
    }
    const styleFiles = globSync('src/styles/*.scss')
    logger.info(`found ${styleFiles.length} style files.`)
    styleFiles.forEach(file => {
        copyFileSync(file, file.replace('src', 'dist'))
    })
    logger.info(`copied.`)
    cb()
}

async function build(cb: TaskFunctionCallback) {
    logger.info('build by rollup')
    const plugins = [
        typescript()
    ]

    const input = {
        ...getComponentEntries(),
        index: dirnameResovle('src/index.ts'),
    }
    // We only produce es mode for now, and we will consider other targets later.
    const bundle = await rollup({
        input,
        plugins,
    })
    await bundle.write({
        dir: dirnameResovle('dist/es'),
        format: 'es',
    })
    cb()
}

function getComponentEntries() {
    const componentsDir = dirnameResovle('src/components')
    const entries: Record<string, string> = {}
    readdirSync(componentsDir).reduce((acc, dir) => {
        const entry = resolve(componentsDir, dir, 'index.tsx')
        if (existsSync(entry)) {
            acc[dir] = entry
        }
        return acc
    }, entries)
    return entries
}

task('build', series(
    clean,
    copyScssFiles,
    build,
))
