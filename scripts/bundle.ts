
import path from 'path'
import SwaggerParser from "@apidevtools/swagger-parser"
import * as childProcess from 'child_process'
import util from 'util'
import fs from 'fs/promises'
import { createHmac } from 'crypto'

const exec = util.promisify(childProcess.exec)

const distPath: string = path.join(__dirname, '../dist')
const srcPath: string = path.join(__dirname, '../src')
const tempPath: string = path.join(distPath, './temp')
const layerPath: string = path.join(distPath, './layerList')
const commonPath = path.join(distPath, './common')
const commonModulePath = path.join(srcPath, './modules/common.ts')

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

			const lambdaName: string = info['x-cdk-lambda-name']
			const additionalLibrary: string[] = info['x-cdk-additional-library'] || []
			
			const handler: string = path.join(srcPath, 'API', info['x-cdk-lambda-handler'])
			const handlerPath = handler.replace(path.extname(handler), '.ts')

			lambdaInfos[lambdaName] = { additionalLibrary, handlerPath }
		}
	}
	
	return lambdaInfos
}

const bundle = async () => {
	await fs.rm(distPath, { recursive: true, force: true })
	await fs.mkdir(layerPath, { recursive: true })
	await fs.mkdir(commonPath, { recursive: true })
	await fs.mkdir(tempPath, { recursive: true })

	const swagger: {[key: string]: any} = await SwaggerParser.parse(path.join(__dirname, '../swagger.yaml'))
	
	const dependencies: {[key: string]: any} = await extractDependencies()
	const lambdaInfos: {[key: string]: any} = await extractLambdaInfos(swagger)

	console.info('gen directories...')
	const commonDependencies: {[key: string]: any} = { ...dependencies }
	for (const lambdaName in lambdaInfos){
		const { handlerPath, additionalLibrary } = lambdaInfos[lambdaName]

		const lambdaTempPath = path.join(tempPath, lambdaName)
		const copiedPath = path.join(lambdaTempPath, path.relative(srcPath, handlerPath))

		await fs.mkdir(path.join(lambdaTempPath), { recursive: true })
		await copyForce(handlerPath, copiedPath)

		const modulePath = path.join(lambdaTempPath, 'modules')
		await fs.mkdir(modulePath)
		await fs.copyFile(commonModulePath, path.join(modulePath, 'common.ts'))

		for (const libraryName of additionalLibrary){
			delete commonDependencies[libraryName]
		}
	}
	// 레이어 올릴 라이브러리 구분

	console.info('gen layerList...')
	const libraryCase: string[] = []
	for (const lambdaName in lambdaInfos){
		const { additionalLibrary } = lambdaInfos[lambdaName]
		
		const useDependencies = { ...commonDependencies }
		for (const libraryName of additionalLibrary){
			useDependencies[libraryName] = dependencies[libraryName]
		}
		const jsonUseDependencies: string = JSON.stringify(useDependencies)
		if(!libraryCase.includes(jsonUseDependencies)){
			libraryCase.push(jsonUseDependencies)
		}
		lambdaInfos[lambdaName].layerCaseName = jsonToHash(jsonUseDependencies)
	}

	for await (const oneCase of libraryCase){
		const layerCaseName = jsonToHash(oneCase)
		const layerCasePath = path.join(layerPath, layerCaseName)
		const modulesPath = path.join(layerCasePath, 'node')
		await fs.mkdir(modulesPath, { recursive: true })

		const useDependencies = JSON.parse(oneCase)
		for (const libraryName in useDependencies){
			const version = useDependencies[libraryName]
			await exec(`npm i --prefix ${modulesPath} ${libraryName}@${version}`)
		}
		await exec(`cd ${layerCasePath} && zip ../${layerCaseName}.zip node/*`)
	}

	const layerJson: {[key: string]: any} = {}
	for (const lambdaName in lambdaInfos){
		const useCase = lambdaInfos[lambdaName].layerCaseName
		layerJson[lambdaName] = useCase
	}

	await fs.writeFile(path.join(layerPath, 'layerList.json'), JSON.stringify(layerJson))
	// console.log(layerJson)
}

const jsonToHash = (string: string): string => 
	createHmac('sha256', 'library')
	.update(string).digest('hex')
	.slice(0, 20)

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

const copyForce = async (src: string, dest: string): Promise<void> => {
	const { dir } = path.parse(dest)
	// console.log(dir)
	await fs.mkdir(dir, { recursive: true })
	await fs.copyFile(src, dest)
}

bundle()
// extractDependencies()