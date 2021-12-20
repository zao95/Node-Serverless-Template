
export const handler = async (event, context) => {
	const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
			message: 'hello world!'
		}),
    }
    
    return response
}

// 1. API 별 필요한 모듈들만...
//  - 