import { Construct } from '@aws-cdk/core'
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway'
import { Runtime, Function, Code, FunctionProps } from '@aws-cdk/aws-lambda'
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
                methodName +
                (pathName === '/' ? '' : changeToUppercaseFirstLetter(pathName))
            const lambda: Function = new Function(scope, lambdaId, {
                functionName: lambdaId,
                description: apiData['description'],
                code: Code.fromAsset(apiData['x-cdk-lambda-code']),
                handler: apiData['x-cdk-lambda-handler'],
                logRetention: RetentionDays.TEN_YEARS,
                ...lambdaProps,
            })

            let integrationParameters: any = undefined
            let methodParameters: any = undefined

            if (apiData.parameters && apiData.parameters.length) {
                const parameters: any[] = apiData.parameters
                integrationParameters = {}
                methodParameters = {}

                parameters.forEach((swaggerParameter, idx) => {
                    const parameterType = getParameterType(swaggerParameter.in)
                    console.log('\nintegrationParameters', idx)
                    console.log(
                        'integrationParameters Key: ',
                        `integration.request.${parameterType}.${swaggerParameter.name}`
                    )
                    console.log(
                        'integrationParameters Value: ',
                        `method.request.${parameterType}.${swaggerParameter.name}`
                    )
                    integrationParameters[
                        `integration.request.${parameterType}.${swaggerParameter.name}`
                    ] = `method.request.${parameterType}.${swaggerParameter.name}`
                    methodParameters[
                        `method.request.${parameterType}.${swaggerParameter.name}`
                    ] = true
                })
            }

            resource.addMethod(
                methodName,
                new LambdaIntegration(lambda, {
                    requestParameters: integrationParameters,
                }),
                {
                    requestParameters: methodParameters,
                }
            )
        })
    })
}

export default convertSwaggerToCdkRestApi
