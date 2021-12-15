import fs from 'fs'
import { globby } from 'globby'
export async function package_refactor() {
	const promise_a = (await globby('packages/*/package.json')).map(
		async package_path=>{
			const package_json = (await fs.promises.readFile(package_path)).toString()
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
				pkg.svelte = './dist/index.js'
			}
			if (!pkg.scripts.build) {
				update = true
				pkg.scripts.build = 'npm run compile'
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
			if (pkg.scripts.test) {
				update = true
				delete pkg.scripts.test
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
				await fs.promises.writeFile(package_path, JSON.stringify(pkg, null, '\t'))
			}
		})
	await Promise.all(promise_a)
}
