
import path from 'path'
import SwaggerParser from "@apidevtools/swagger-parser"
import * as childProcess from 'child_process'
import util from 'util'
import fs from 'fs/promises'
const exec = util.promisify(childProcess.exec)

const distPath: string = path.join(__dirname, '../dist')
const tempPath: string = path.join(distPath, './temp')

const getRemoveLibraries = async () => {
	const swagger: {[key: string]: any} = await SwaggerParser.parse(path.join(__dirname, '../swagger.yaml'))
	const { paths } = swagger
	
	let removeLibraries: string[] = []
	for (const pathKey in paths ){
		const path = paths[pathKey]
		for (const method in path ){
			const additionalLibrary: string[] = path[method]['x-cdk-additional-library']
			if(additionalLibrary){
				additionalLibrary.forEach(library => removeLibraries.push(library))
			}
		}
	}
	return removeLibraries
}

const parsePackageJson = async () => {
	const packageJson = await fs.readFile(path.join(__dirname, '../package.json'))
	console.log()
}

const bundleLibrary = async () => {
	const commonPath = path.join(distPath, './common')
	await fs.mkdir(commonPath, { recursive: true })
	await fs.copyFile(path.join(__dirname, '../package.json'), path.join(commonPath, './package.json'))
	await exec(`cd ${commonPath} && npm install --production`)
	console.info('install complete')

	const removeLibraries = await getRemoveLibraries()
	for await (const target of removeLibraries){
		await exec(`cd ${commonPath} && npm remove ${target}`)
	}
	console.info('remove complete')
	
	const nodeModulesPath = path.join(commonPath, './node_modules')
	const dirs = await fs.readdir(tempPath)
	const promiseRes = dirs.map(async dir => {
		const apiPath = path.join(tempPath, dir)
		await copy(nodeModulesPath, path.join(apiPath, './node_modules'))
	})

	for await (const res of promiseRes){
		await res
	}
	console.info('bundle complete')
}

const copy = async (src: string, dest: string): Promise<void> => {
	const stat = await fs.lstat(src)
	if(stat.isDirectory()){
		await fs.mkdir(dest, { recursive: true })
		const dirs = await fs.readdir(src)
		for await (const dir of dirs){
			const [srcPath, destPath] = [path.join(src, dir), path.join(dest, dir)]
			await copy(srcPath, destPath)
		}
	} else {
		await fs.copyFile(src, dest)
	}
}

bundleLibrary()
// getRemoveLibraries()