
import path from 'path'
import SwaggerParser from "@apidevtools/swagger-parser"
import * as childProcess from 'child_process'
import util from 'util'
import fs from 'fs/promises'
const exec = util.promisify(childProcess.exec)

const distPath: string = path.join(__dirname, '../dist')
const srcPath: string = path.join(__dirname, '../src')
const tempPath: string = path.join(distPath, './temp')

const extractDependencies = async (): Promise<{[key: string]: any}> => {
	const packageJsonData = await fs.readFile(path.join(__dirname, '../package.json'))
	const packageJson = Buffer.from(packageJsonData).toString('utf-8')
	const packageInfo = JSON.parse(packageJson)
	const dependencies: {[key: string]: any} = packageInfo?.dependencies || {}
	return dependencies
}

const extractLambdaInfos = async (swagger: {[key: string]: any}): Promise<{[key: string]: any}> => {
	const { paths } = swagger
	
	const lambdaInfos: {[key: string]: any} = {}
	for (const pathKey in paths ){
		const pathInfo = paths[pathKey]
		for (const method in pathInfo ){
			const info = pathInfo[method]
			const additionalLibrary: string[] = info['x-cdk-additional-library']
			const lambdaName: string = info['x-cdk-lambda-name']
			const handlerPath: string = path.join(srcPath, 'API', info['x-cdk-lambda-handler'])

			lambdaInfos[lambdaName] = { handlerPath }
			if(additionalLibrary){
				lambdaInfos[lambdaName].additionalLibrary = additionalLibrary
			}
		}
	}
	
	return lambdaInfos
}

const bundle = async () => {
	const swagger: {[key: string]: any} = await SwaggerParser.parse(path.join(__dirname, '../swagger.yaml'))
	const commonPath = path.join(distPath, './common')
	await fs.mkdir(commonPath, { recursive: true })

	const dependencies: {[key: string]: any} = await extractDependencies()
	const lambdaInfos: {[key: string]: any} = await extractLambdaInfos(swagger)

	await fs.mkdir(tempPath, { recursive: true })
	for (const lambdaName in lambdaInfos){
		const { handlerPath } = lambdaInfos[lambdaName]
		await fs.mkdir(path.join(tempPath, lambdaName), { recursive: true })
		console.log()
	}

	// const commonDependencies: {[key: string]: any} = { ...dependencies }
	// const additionalDependencies: {[key: string]: any} = {}
	// for await (const excludeTargetKey of additionalLibraries){
	// 	const version = commonDependencies[excludeTargetKey]
	// 	delete commonDependencies[excludeTargetKey]
	// 	additionalDependencies[excludeTargetKey] = version
	// }
	// console.log(additionalDependencies)

	// for (const libraryName in commonDependencies){
	// 	const version = commonDependencies[libraryName]
	// 	await exec(`npm i --prefix ${commonPath} ${libraryName}@${version}`)
	// }
	// console.info('sample install complete')
	
	// const nodeModulesPath = path.join(commonPath, './node_modules')
	// const dirs = await fs.readdir(tempPath)
	// const promiseRes = dirs.map(async dir => {
	// 	const apiPath = path.join(tempPath, dir)
	// 	await copy(nodeModulesPath, path.join(apiPath, './node_modules'))
	// 	await exec(`npm i --prefix ${apiPath} ${libraryName}@${version}`)
	// })

	// for await (const res of promiseRes){
	// 	await res
	// }
	// console.info('bundle complete')
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

bundle()
// extractDependencies()