export interface requestType<P, Q> {
    params: P
    query: Q
    path: string
    httpMethod: string
    headers: headers
}

interface headers {
    'user-agent': string
    accept: string
    'postman-token': string
    host: string
    'accept-encoding': string
    connection: string
    'Access-Control-Allow-Origin': string
}

export const checkRequireParams = (
    params: { [key: string]: any },
    checkList: string[]
): boolean => {
    return checkList.every((paramName) => {
        if (typeof params[paramName] === 'undefined') {
            return false
        }
        return true
    })
}

export const createError = (res) => {
    res
}

export const reqParse = <P, Q>(reqOriginal): requestType<P, Q> => {
    let event
    if (process.env.APP_ENV === 'Offline') {
        event = {
            params: reqOriginal.params,
            query: reqOriginal.query,
            path: reqOriginal.path,
            httpMethod: '오프라인 테스트 환경에서 지원하지 않습니다.',
            headers: reqOriginal.headers,
        }
    } else {
        event = {
            params: reqOriginal.apiGateway.event.pathParameters,
            query: reqOriginal.apiGateway.event.queryStringParameters,
            path: reqOriginal.apiGateway.event.path,
            httpMethod: reqOriginal.apiGateway.event.httpMethod,
            headers: reqOriginal.apiGateway.event.headers,
        }
    }
    return event
}

// API Gateway event & Express req조합

// path: event.path

// API Gateway event
// resource: event.resource,
// path: event.path,
// httpMethod: event.httpMethod,
// headers: event.headers,
// multiValueHeaders: event.multiValueHeaders,
// queryStringParameters: event.queryStringParameters,
// multiValueQueryStringParameters: event.multiValueQueryStringParameters,
// pathParameters: event.pathParameters,
// stageVariables: event.stageVariables,
// requestContext: event.requestContext,
// isBase64Encoded: event.isBase64Encoded,

// Express req
// req.params : 이름 붙은 라우트 파라미터를 담는다. ex : app.get(’/:idx’, (req, res) => { res.send(req.params.idx); }); ->
// req.params(name) : 이름 붙은 라우트 파라미터나 GET, POST 파라미터를 담는다. 하지만 여러가지 혼란을 줄 수 있어 사용하는 것을 지양해야한다.
// req.query : GET 방식으로 넘어오는 쿼리 스트링 파라미터를 담고 있다.
// req.body : POST 방식으로 넘어오는 파라미터를 담고있다. HTTP의 BODY 부분에 담겨져있는데, 이 부분을 파싱하기 위해 body-parser와 같은 패키지가 필요하다.
// req.route : 현재 라우트에 관한 정보. 디버깅용.
// req.cookies (req.signedCookies) : 클라이언트가 전달한 쿠키 값을 가진다.
// req.headers : HTTP의 Header 정보를 가지고 있다.
// req.accepts([types]) : 클라이언트가 해당하는 타입을 받을 수 있는지 확인하는 간단한 메서드.
// req.ip : 클라이언트의 IP Address
// req.path : 클라이언트가 요청한 경로. 프로토콜, 호스트, 포트, 쿼리스트링을 제외한 순수 요청 경로다.
// req.host : 요청 호스트 이름을 반환하는 간단한 메서드. 조작될 수 있으므로 보안 목적으로는 사용하면 안된다.
// req.xhr : 요청이 ajax 호출로 시작되었다면 true를 반환하는 프로퍼티
// req.protocol : 현재 요청의 프로토콜 (http, https 등)
// req.secure : 현재 요청이 보안 요청(SSL?) 이면 true를 반환
// req.url (req.originalUrl) : URL 경로와 쿼리 스트링을 반환. 원본 요청을 logging하는 목적으로 많이 쓰임.
// req.acceptedLanguages : 클라이언트가 선호하는 자연어 목록을 반환. header에서 파싱하면 다국어를 지원한는 어플리케이션이라면 초기 언어 선택에 도움을 줄 수 있음.
