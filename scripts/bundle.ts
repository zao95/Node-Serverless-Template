
import fs from 'fs/promises'
import path from 'path'

const tempPath = path.join(__dirname, '../dist/temp')
const fromPath = path.join(__dirname, '../src')

const copyFileInDirectory = async (fromRoot: any, toRoot: any, filePath: any): Promise<void> => {
	const { name: fileName, ext } = path.parse(filePath)
	const { dir: realativePath } = path.parse(path.relative(fromRoot, filePath))
	
	const apiRootPath = path.join(toRoot, fileName, realativePath)
	await fs.mkdir(apiRootPath, { recursive: true })
	fs.copyFile(filePath, path.join(apiRootPath, `./${fileName}${ext}`))
}

const readDirectory = async (searchPath: any): Promise<void> => {
	const dirNames = await fs.readdir(searchPath)
	
	for await (const name of dirNames){
		const nowPath = path.join(searchPath, `./${name}`)
		if(name.includes('.')){
			await copyFileInDirectory(fromPath, tempPath, nowPath)
			// console.log([searchPath.split(path.sep), name])
		} else {
			await readDirectory(nowPath)
		}
	}
}

const bundle = async () => {
	await fs.mkdir(tempPath, { recursive: true })
	const commonModulePath = path.join(fromPath, './modules/common.ts')

	await readDirectory(path.join(fromPath, './API'))
	const apiDirNames = await fs.readdir(tempPath)

	for await (const apiDir of apiDirNames){
		const moduleDir = path.join(tempPath, apiDir, 'modules')
		await fs.mkdir(moduleDir)
		await fs.copyFile(commonModulePath, path.join(moduleDir, 'common.ts'))
	}
}

bundle()

// 1. src 내부의 API들을 읽어서 APIs를 최상위구조에 할당. lambda 이름을 붙인 폴더 내부에 구조 복사
// 2. modules는 최상위구조에 할당.
// 3. 라이브러리는 일단 나중에 1, 2부터 ㄱㄱ
