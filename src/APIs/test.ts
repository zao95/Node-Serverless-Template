import { checkRequireParams, reqParse, requestType } from '../utils/utils'
import mysql from '../utils/testdb'

// params in deploy
// "params":{"proxy":"test12asd"}
// "path":"/test12asd"
// :name <= Not worked!
const GET = (app) => {
    app.get('/test', async (req, res) => {
        try {
            const connect = await mysql()
            const [response, fields] = await connect.query(`SELECT * FROM users`)
            const data = []
            for (let [key, t1] of Object.entries(response)) {
                data.push({idx: response[key].idx, value: response[key].value})
            }
            res.status(200)
            res.json({
                data: data,
                // params: temp.params,
                // query: temp.query,
                // path: temp.path,
                // httpMethod: temp.httpMethod,
                // headers: temp.headers,
            })
        } catch (e) {
            console.log(e)
            res.status(400)
            res.json({
                error: e.toString()
            })
        }
    })
}
interface PostTestQuery {
    data: string,
}

const POST = (app) => {
    app.post('/test', async (req, res) => {
        try {
            const temp: requestType<{}, PostTestQuery> = reqParse(req)
            const inputQuery = temp.query
            if (!checkRequireParams(inputQuery, ['data'])) {
                throw Error('E01001')
            }

            const connect = await mysql()
            const [response, fields] = await connect.execute('INSERT INTO users(value) VALUES(?)', [inputQuery.data])

            if (!response[0]?.affectedRows) {
                throw Error('E04001')
            }
            res.status(200)
            res.json({
                message: 'Data Input Success!',
            })
        }
        catch (e) {
            console.log(e)
            res.status(400)
            res.json({
                error: e.toString()
            })
        }
    })
}

interface PutTestQuery {
    idx: number,
    data: string,
}

const PUT = (app) => {
    app.put('/test', async (req, res) => {
        try {
            const temp: requestType<{}, PutTestQuery> = reqParse(req)
            const inputQuery = temp.query
            if (!checkRequireParams(inputQuery, ['idx', 'data'])) {
                throw Error('E01001')
            }

            const connect = await mysql()
            const [response, fields] = await connect.execute('UPDATE `users` SET `value` = ? WHERE `idx` = ?', [inputQuery.data, inputQuery.idx])

            if (!response[0]?.affectedRows) {
                throw Error('E04001')
            }
            res.status(200)
            res.json({
                message: 'Data Change Success!',
            })
        }
        catch (e) {
            console.log(e)
            res.status(400)
            res.json({
                error: e.toString()
            })
        }
    })
}

interface DeleteTestQuery {
    idx: number,
}

const DELETE = (app) => {
    app.delete('/test', async (req, res) => {
        try {
            const temp: requestType<{}, DeleteTestQuery> = reqParse(req)
            const inputQuery = temp.query
            if (!checkRequireParams(inputQuery, ['idx'])) {
                throw Error('E01001')
            }

            const connect = await mysql()
            const [response, fields] = await connect.execute('DELETE FROM `users` WHERE `idx` = ?', [inputQuery.idx])

            if (!response[0]?.affectedRows) {
                throw Error('E04001')
            }
            res.status(200)
            res.json({
                message: 'Data Delete Success!',
            })
        }
        catch (e) {
            console.log(e)
            res.status(400)
            res.json({
                error: e.toString()
            })
        }
    })
}

export default {
    GET,
    POST,
    PUT,
    DELETE,
}