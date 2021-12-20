
import SwaggerParser from "@apidevtools/swagger-parser"
import http from 'http'

const port: number = 3001

const offline = async () => {
    try {
        const swagger: {[key: string]: any} = await SwaggerParser.parse('./swagger.yaml')
        const { paths } = swagger
        for (const pathKey in paths){
            const methods = paths[pathKey]
            for (const methodKey in methods){
                const lambdaSource = methods[methodKey]['x-cdk-lambda-handler'].replace(/\/, )
                console.log([pathKey, methodKey, lambdaSource])
            }
        }
        // console.log('s: ', swagger.paths['/{pathtest}'].get.parameters)
        console.info('swagger parsing complete!')
        console.info(`offline server: http://localhost:${port}`)













        http.createServer(async (req: any, res: any) => {
            const extractBody = new Promise((resolve, reject) => {
                let body: any = []
                req.on('data', (chunk: any) => {
                    body.push(chunk)
                }).on('end', () => {
                    body = Buffer.concat(body).toString()
                    resolve(body)
                })
            })
            const body = await extractBody

            const queryStringParameters: {[key: string]: any} = {}
            const [url, queryString] = req.url.split('?')
            console.log('url: ', url)
            const queries = queryString.split('&')
            for (const query of queries){
                const [key, value] = query.split('=')
                queryStringParameters[key] = value
            }
            console.log(queryStringParameters)
            console.log('b: ', body)

            // console.log('req: ', req)
            // const event = {
            //     "resource": req.url,
            //     "path": url,
            //     "httpMethod": req.method,
            //     "headers": req.headers,
            //     "queryStringParameters": queryStringParameters,
            //     "multiValueQueryStringParameters": queryStringParameters,
            //     "pathParameters": null,
            //     "stageVariables": null,
            //     "requestContext": {
            //         "resourceId": "2gxmpl",
            //         "resourcePath": req.url,
            //         "httpMethod": req.method,
            //         "extendedRequestId": "JJbxmplHYosFVYQ=",
            //         "requestTime": (new Date()).toLocaleString(),
            //         "path": "/Prod/",
            //         "accountId": "123456789012",
            //         "protocol": "HTTP/1.1",
            //         "stage": "Prod",
            //         "domainPrefix": "70ixmpl4fl",
            //         "requestTimeEpoch": 1583798639428,
            //         "requestId": "77375676-xmpl-4b79-853a-f982474efe18",
            //         "identity": {
            //             "cognitoIdentityPoolId": null,
            //             "accountId": null,
            //             "cognitoIdentityId": null,
            //             "caller": null,
            //             "sourceIp": "52.255.255.12",
            //             "principalOrgId": null,
            //             "accessKey": null,
            //             "cognitoAuthenticationType": null,
            //             "cognitoAuthenticationProvider": null,
            //             "userArn": null,
            //             "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
            //             "user": null
            //         },
            //         "domainName": "offline",
            //         "apiId": "offline"
            //     },
            //     "body": body,
            //     "isBase64Encoded": false
            // }
            // console.log('event: ', event)
        }).listen(port)
    } catch (e: any) {
        console.error(e.toString())
    }
}

(async () => await offline())()