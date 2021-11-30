import { APIGatewayProxyHandler } from 'aws-lambda'
import { createServer, proxy } from 'aws-serverless-express'
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import express from 'express'
import test from './APIs/test'
import cache from './APIs/cache'
import dev from './APIs/dev'
import prod from './APIs/prod'

const app = express()
const port = 3000

if (process.env.APP_ENV === 'Offline') {
    app.use(express.json())
    // app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
} else {
    app.use(awsServerlessExpressMiddleware.eventContext())
}

app.get('/', (req, res) => {
    try {
        res.status(200)
        res.json({
            message: 'It works!',
        })
    } catch (e) {
        res.status(200)
        res.json({
            message: e.toString(),
        })
    }
})

Object.values(test).forEach((API) => {
    API(app)
})
Object.values(cache).forEach((API) => {
    API(app)
})
Object.values(dev).forEach((API) => {
    API(app)
})
Object.values(prod).forEach((API) => {
    API(app)
})

if (process.env.APP_ENV === 'Offline') {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
}

const server = createServer(app)

export const handler: APIGatewayProxyHandler = (event, context) => {
    proxy(server, event, context)
}
