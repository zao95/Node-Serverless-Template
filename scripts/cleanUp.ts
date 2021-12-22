
import fs from 'fs/promises'
import path from 'path'



const cleanUp = async () => {
	const tempPath = path.join(__dirname, '../dist/temp')
	await fs.rm(tempPath, { recursive: true, force: true })
}

cleanUp()

// 1. src 내부의 API들을 읽어서 APIs를 최상위구조에 할당. lambda 이름을 붙인 폴더 내부에 구조 복사
// 2. modules는 최상위구조에 할당.
// 3. 라이브러리는 일단 나중에 1, 2부터 ㄱㄱ
