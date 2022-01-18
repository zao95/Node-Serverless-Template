
import path from 'path'
import fs from 'fs/promises'
import AWS from 'aws-sdk'

const layerListPath = path.join(__dirname, '../dist/layerList')

const uploadLayer = async () => {
	console.info('get stored Layers...')
	const s3 = new AWS.S3()
	const params = {
		Bucket: 'test-tlqkf2'
	}

	const objectList = await s3.listObjects(params).promise()
	const contents: {[key: string]: any}[] = objectList?.Contents || []
	
	const s3LibraryTable: {[key: string]: any} = {}
	contents.forEach(({ Key }) => { s3LibraryTable[Key] = true })

	console.info('compare new Layers...')
	const unuseLibraryTable: {[key: string]: any} = { ...s3LibraryTable }
	const addLibraryList: string[] = []
	const localLibraryList = (await fs.readdir(layerListPath))
	localLibraryList.forEach(libraryName => {
		if(unuseLibraryTable[libraryName]){
			delete unuseLibraryTable[libraryName]
		} else {
			addLibraryList.push(libraryName)
		}
	})
	// console.log([unuseLibraryTable, addLibraryList])

	console.info('remove unuse Layers...')
	for (const Key in unuseLibraryTable){
		await s3.deleteObject({ Bucket: 'test-tlqkf2', Key }).promise()
	}

	console.info('save new Layers...')
	for (const libraryName of addLibraryList){
		const file = await fs.readFile(path.join(layerListPath, libraryName))
		await s3.upload({ Bucket: 'test-tlqkf2', Key: libraryName, Body: file }).promise()
	}
}

uploadLayer()
