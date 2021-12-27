import { Construct } from '@aws-cdk/core'
import {
    RestApi,
    LambdaIntegration,
    Model,
    JsonSchemaType,
    RequestValidator,
} from '@aws-cdk/aws-apigateway'
import {
    Runtime,
    Function,
    Code,
    FunctionProps,
    Tracing,
} from '@aws-cdk/aws-lambda'
import { IVpc, Vpc, SubnetType } from '@aws-cdk/aws-ec2'
import { LogGroup, RetentionDays } from '@aws-cdk/aws-logs'

const changeToUppercaseFirstLetter = (strings: string): string => {
    return strings
        .replace(/\{|\}/g, '')
        .split('/')
        .map(
            (string) =>
                string.slice(0, 1).toUpperCase() +
                string.slice(1, string.length)
        )
        .join('')
}

const getParameterType = (swaggerIn: string): string => {
    if (swaggerIn === 'query') return 'querystring'
    else if (swaggerIn === 'path') return 'path'
    else if (swaggerIn === 'header') return 'header'
    else if (swaggerIn === 'body') return 'body'
    else
        throw new Error(
            `요청하신 api parameter 종류인 ${swaggerIn}을 찾을 수 없습니다.`
        )
}

const isEmpty = (param) => Object.keys(param).length === 0

const jsonSchemaTypeDictionary = {
    array: JsonSchemaType.ARRAY,
    boolean: JsonSchemaType.BOOLEAN,
    integer: JsonSchemaType.INTEGER,
    null: JsonSchemaType.NULL,
    number: JsonSchemaType.NUMBER,
    object: JsonSchemaType.OBJECT,
    string: JsonSchemaType.STRING,
}

interface ILambdaProps {
    runtime
    allowAllOutbound?
    allowPublicSubnet?
    codeSigningConfig?
    currentVersionOptions?
    deadLetterQueue?
    deadLetterQueueEnabled?
    description?
    environment?
    environmentEncryption?
    events?
    filesystem?
    functionName?
    initialPolicy?
    layers?
    logRetention?
    logRetentionRetryOptions?
    logRetentionRole?
    maxEventAge?
    memorySize?
    onFailure?
    onSuccess?
    profiling?
    profilingGroup?
    reservedConcurrentExecutions?
    retryAttempts?
    role?
    securityGroup?
    securityGroups?
    timeout?
    tracing?
    vpc?
    vpcSubnets?
    key?
}
const convertSwaggerToCdkRestApi = (
    scope: Construct,
    lambdaName: string,
    apiGateway: RestApi,
    swagger: any,
    lambdaProps?: ILambdaProps
) => {
    let paths = Object.keys(swagger.paths)

    paths.forEach((pathName) => {
        const resource = apiGateway.root.resourceForPath(pathName)
        const methods = Object.keys(swagger.paths[pathName])

        methods.forEach((methodName) => {
            const apiData = swagger.paths[pathName][methodName]
            const lambdaId =
                lambdaName +
                changeToUppercaseFirstLetter(methodName) +
                (pathName === '/' ? '' : changeToUppercaseFirstLetter(pathName))
            const lambda: Function = new Function(scope, lambdaId, {
                functionName: lambdaId,
                description: apiData['description'],
                code: Code.fromAsset(apiData['x-cdk-lambda-code']),
                handler: apiData['x-cdk-lambda-handler'],
                tracing: Tracing.ACTIVE,
                ...lambdaProps,
            })

            let hasRequestParameter: boolean = false
            let hasRequestBody: boolean = false
            let integrationParameters: any = undefined
            let methodParameters: any = undefined
            let modelSchema: any = undefined

            if (apiData['parameters'] && apiData['parameters'].length) {
                const parameters: any[] = apiData['parameters']
                integrationParameters = {}
                methodParameters = {}

                parameters.forEach((parameter, idx) => {
                    const parameterType = getParameterType(parameter['in'])
                    if (parameterType === 'body') {
                        hasRequestBody = true
                        modelSchema = {}
                        const schema = parameter['schema']
                        modelSchema.title = lambdaId
                        modelSchema.description = apiData['description']
                        modelSchema.type = jsonSchemaTypeDictionary[schema.type]
                        if (!isEmpty(schema.properties)) {
                            modelSchema.properties = {}
                            for (const property in schema.properties) {
                                const propertyType =
                                    schema.properties[property].type
                                modelSchema.properties[property] = {
                                    type: jsonSchemaTypeDictionary[
                                        propertyType
                                    ],
                                }
                            }
                        }
                        if (!isEmpty(schema.required)) {
                            modelSchema.required = schema.required
                        }
                    } else {
                        hasRequestParameter = true
                        integrationParameters[
                            `integration.request.${parameterType}.${parameter['name']}`
                        ] = `method.request.${parameterType}.${parameter['name']}`
                        methodParameters[
                            `method.request.${parameterType}.${parameter['name']}`
                        ] = parameter.required ?? false
                    }
                })
            }

            let model = undefined
            if (modelSchema) {
                model = apiGateway.addModel(`${lambdaId}Model`, {
                    modelName: `${lambdaId}Model`,
                    description: apiData['description'],
                    contentType: apiData['produces'][0],
                    schema: modelSchema,
                })
            }

            let requestValidator: any = undefined
            if (hasRequestBody || hasRequestParameter) {
                requestValidator = new RequestValidator(
                    scope,
                    `${lambdaId}RequestValidator`,
                    {
                        restApi: apiGateway,
                        requestValidatorName: `${lambdaId}RequestValidator`,
                        validateRequestBody: hasRequestBody,
                        validateRequestParameters: hasRequestParameter,
                    }
                )
            }

            resource.addMethod(
                methodName,
                new LambdaIntegration(lambda, {
                    requestParameters: integrationParameters,
                }),
                {
                    ...(modelSchema && {
                        requestModels: {
                            [apiData['produces'][0]]: model,
                        },
                    }),
                    ...(requestValidator && {
                        requestValidator: requestValidator,
                    }),
                    requestParameters: methodParameters,
                }
            )
        })
    })
}

export default convertSwaggerToCdkRestApi
