
import devDB from '../utils/devdb'
import { reqParse, requestType,  } from '../utils/utils'

interface GetTempQuery {
    srl: string,
}

const GET = (app) => {
    app.get('/dev', async (req, res) => {
        let connect
        try {
            const reqObj: requestType<{}, GetTempQuery> = reqParse(req)
            console.log('reqObj')
            console.log(reqObj)
            connect = await devDB()
            const [response, fields] = await connect.execute(
                'SELECT * FROM `delivery_order` WHERE `srl` = ?', [reqObj.query.srl]
            )
            console.log('response')
            console.log(response)
            console.log('response[0]')
            console.log(response[0])
            res.status(200)
            res.json({
                data: response[0],
            })
        } catch (e) {
            console.log(e)
            res.status(400)
            res.json({
                error: e.toString()
            })
        } finally {
            await connect.end()
        }
    })
}

export default {
    GET,
}