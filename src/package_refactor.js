import fs from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'
const exec_async = promisify(exec)
export async function package_refactor() {
	await exec_async('find lib/*/package.json')
		.then($=>$.stdout.trim().split('\n').map(
			async $=>{
				const package_json = (await fs.promises.readFile($)).toString()
				let pkg = JSON.parse(package_json)
				const { name } = pkg
				const replacement = name.replace(/^@/, '')
				let update
				const pkg_repository_type = 'git'
				const pkg_repository_url = `https://github.com/${replacement}.git`
				if (pkg.repository?.type !== pkg_repository_type || pkg.repository?.url !== pkg_repository_url) {
					update = true
					pkg.repository = { type: pkg_repository_type, url: pkg_repository_url }
				}
				const pkg_bugs_url = `https://github.com/${replacement}/issues`
				if (pkg.bugs?.url !== pkg_bugs_url) {
					update = true
					pkg.bugs = { url: pkg_bugs_url }
				}
				const pkg_homepage = `https://github.com/${replacement}#readme`
				if (pkg.homepage !== pkg_homepage) {
					update = true
					pkg.homepage = pkg_homepage
				}
				if (pkg.gitHead) {
					update = true
					delete pkg.gitHead
				}
				if (pkg.type !== 'module') {
					update = true
					pkg.type = 'module'
				}
				if (!pkg.scripts) {
					update = true
					pkg.scripts = {}
				}
				if (!pkg.svelte) {
					update = true
					pkg.svelte = './lib/index.js'
				}
				if (!pkg.scripts.build) {
					update = true
					pkg.scripts.build = 'pnpm compile'
				}
				if (!pkg.devDependencies) {
					update = true
					pkg.devDependencies = {}
				}
				if (!pkg.devDependencies.typescript) {
					update = true
					pkg.devDependencies.typescript = 'next'
				}
				if (!pkg.scripts.exec) {
					update = true
					pkg.scripts.exec = '$@'
				}
				if (pkg.sideEffects !== false) {
					update = true
					pkg.sideEffects = false
				}
				if (pkg.gitHead) {
					update = true
					delete pkg.gitHead
				}
				if (/\n  /.test(package_json)) {
					update = true
				}
				if (update) {
					console.debug(replacement, {
						repository: pkg.repository,
						bugs: pkg.bugs,
						homepage: pkg.homepage,
					})
					await fs.promises.writeFile($, JSON.stringify(pkg, null, '\t'))
				}
			}))
		.then($a=>Promise.all($a))
}
