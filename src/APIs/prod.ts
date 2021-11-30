
import prodDB from '../utils/proddb'
import { reqParse, requestType,  } from '../utils/utils'

interface GetTempQuery {
    srl: string,
}

const GET = (app) => {
    app.get('/prod', async (req, res) => {
        try {
            const reqObj: requestType<{}, GetTempQuery> = reqParse(req)
            const connect = await prodDB()
            const [response, fields] = await connect.execute(
                'SELECT * FROM `delivery_order` WHERE `srl` = ?', [reqObj.query.srl]
            )
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
        }
    })
}

export default {
    GET,
}