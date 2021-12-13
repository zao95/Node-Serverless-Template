
import SwaggerParser from 'swagger-parser'

SwaggerParser.parse('../swagger.yaml').then((swagger) => {
    console.log('s: ', swagger)
})
