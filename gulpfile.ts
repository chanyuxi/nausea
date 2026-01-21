import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { stat, copyFile, mkdir, readdir } from 'node:fs/promises'

import type { TaskFunctionCallback } from 'gulp'
import { series, task } from 'gulp'

import { rimraf } from 'rimraf'
import { glob } from 'glob'

import type { Plugin, ModuleFormat } from 'rollup'
import { rollup } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const root = fileURLToPath(new URL('.', import.meta.url))

function rootResovle(...args: string[]) {
	return resolve(root, ...args)
}

async function clean(cb: TaskFunctionCallback) {
	await rimraf(rootResovle('dist'))
	cb()
}

async function copyScssFiles() {
	const getDest = (file: string) => file.replace('src', 'dist')
	const files = await glob('src/styles/**/*.scss')
	await Promise.all(
		files.map(file => safeCopy(file, getDest))
	);
}

async function safeCopy(src: string, getDest: (file: string) => string) {
	const dest = getDest(src)
	const destDir = dirname(dest)
	await stat(destDir).catch(async () => {
		await mkdir(destDir, { recursive: true })
	})
	await copyFile(src, dest)
}

async function getComponentEntries() {
	const componentsDir = rootResovle('src/components')
	const entries: Record<string, string> = {}

	const dirs = await readdir(componentsDir)
	await Promise.all(
		dirs.map(async (dir) => {
			const entry = resolve(componentsDir, dir, 'index.tsx')
			try {
				await stat(entry)
				entries[dir] = entry
			} catch (error) {
			}
		})
	)

	return entries
}

function isExternal(id: string) {
	return id.startsWith('react')
}

function getPlugins(format: ModuleFormat) {
	const plugins: Plugin[] = [
		typescript()
	]
	if (format === 'es') {
	}
	return plugins
}

async function buildImpl(input: Record<string, string>, format: ModuleFormat) {
	const bundle = await rollup({
		input,
		external: isExternal,
		plugins: getPlugins(format),
	})
	await bundle.write({
		dir: rootResovle(`dist/${format}`),
		format,
	})
}

async function buildDts(input: Record<string, string>) {
	const bundle = await rollup({
		input,
		plugins: [dts()]
	});
	await bundle.write({
		dir: `dist/types`,
		format: 'es'
	});
}

async function build(cb: TaskFunctionCallback) {
	const componentEntries = await getComponentEntries()
	const input = {
		...componentEntries,
		index: rootResovle('src/index.ts'),
	}

	await Promise.all([
		...[copyScssFiles(), buildImpl(input, 'es')],
		buildDts(input),
	])
	cb()
}

task('build', series(
	clean,
	build,
))
