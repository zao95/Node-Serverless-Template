const fs = require('fs/promises')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const directoryExistCheck = async (directoryPath) => {
    let directoryIsExist = null

    try {
        await fs.access(directoryPath)
        directoryIsExist = true
    } catch (e) {
        if (e.errno === -4058) directoryIsExist = false
        else throw new Error(e)
    }

    return directoryIsExist
}

const makeDirectory = async (directoryPath) => {
    let isSuccess = null

    if (await directoryExistCheck(directoryPath)) {
        isSuccess = true
    } else {
        await fs.mkdir(directoryPath, { recursive: true })
    }
    if (!(await directoryExistCheck(directoryPath))) {
        isSuccess = false
    }

    return isSuccess
}

const removeDirectory = async (directoryPath) => {
    try {
        let isSuccess = true

        if (await directoryExistCheck(directoryPath)) {
            await fs.rmdir(directoryPath, {
                recursive: true,
                force: true,
            })
        }
        if (await directoryExistCheck(directoryPath)) {
            isSuccess = false
        }

        return isSuccess
    } catch (e) {
        throw new Error(e)
    }
}

const installOnlyProd = async () => {
    let isSuccess = false
    const commands = {
        npm: 'npm install --only=prod',
        yarn: 'yarn install --production=true',
    }
    for (const command in commands) {
        const result = await exec(commands[command])
        if (!result.stderr) {
            isSuccess = true
            break
        }
    }
    if (!isSuccess) {
        throw new Error('라이브러리를 설치하지 못했습니다.')
    }
}

const timer = () => {
    const timer = setInterval(() => {
        process.stdout.write('.')
    }, 100)
    const clearTimer = () => {
        clearInterval(timer)
    }
    return clearTimer
}

const loadProcess = async (name, func, params = []) => {
    const time = timer()
    process.stdout.write(`${name} start...`)
    try {
        const result = await func(...params)
        process.stdout.write(`complete\n`)
        return result
    } catch (e) {
        process.stdout.write(`error\n`)
        return Promise.reject(Error(e))
    } finally {
        time()
    }
}

const install = async () => {
    try {
        // Remove node_modules directory
        const isRemoved = await loadProcess(
            'removeDirectory',
            removeDirectory,
            ['./node_modules']
        )
        if (!isRemoved)
            throw new Error('node_modules 폴더를 삭제하지 못했습니다.')

        // Install libraries
        await loadProcess('installOnlyProd', installOnlyProd)

        // Make dist directory
        const ismaked = await loadProcess('makeDirectory', makeDirectory, [
            './dist',
        ])
        if (!ismaked) throw new Error('dist 폴더를 생성하지 못했습니다.')

        // Move node_modules to dist/node_modules directory

        console.log('Install complete!')
    } catch (e) {
        console.error(e)
    }
}

;(async () => await install())()
