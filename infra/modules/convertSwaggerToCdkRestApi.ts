import { Construct } from '@aws-cdk/core'
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway'
import { Runtime, Function, Code, FunctionProps } from '@aws-cdk/aws-lambda'
import { IVpc, Vpc, SubnetType } from '@aws-cdk/aws-ec2'
import { RetentionDays } from '@aws-cdk/aws-logs'

interface lambdaProps {
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
    swaggerApi: any,
    lambdaProps?: lambdaProps
) => {
    console.log(swaggerApi)
    let createdLambdas: Map<string, Function> = new Map<string, Function>()
    let paths = Object.keys(swaggerApi.paths)

    paths.forEach((pathName) => {
        const resource = apiGateway.root.resourceForPath(pathName)
        const methods = Object.keys(swaggerApi.paths[pathName])

        methods.forEach((methodName) => {
            let endpoint = swaggerApi.paths[pathName][methodName]
            let backingLambda: Function

            if (createdLambdas.has(endpoint['x-cdk-lambda-name']) === false) {
                createdLambdas.set(
                    endpoint['x-cdk-lambda-name'],
                    new Function(scope, endpoint['x-cdk-lambda-name'], {
                        code: Code.fromAsset(endpoint['x-cdk-lambda-code']),
                        handler: endpoint['x-cdk-lambda-handler'],
                        ...lambdaProps,
                    })
                )
            }

            backingLambda = createdLambdas.get(endpoint['x-cdk-lambda-name'])!

            let integrationParameters: any = undefined
            let methodParameters: any = undefined

            if (endpoint.parameters && endpoint.parameters.length) {
                let parameters: any[] = endpoint.parameters
                integrationParameters = {}
                methodParameters = {}

                parameters.forEach((swaggerParameter) => {
                    integrationParameters[
                        `integration.request.${swaggerParameter.in}.${swaggerParameter.name}`
                    ] = `method.request.${swaggerParameter.in}.${swaggerParameter.name}`
                    methodParameters[
                        `method.request.${swaggerParameter.in}.${swaggerParameter.name}`
                    ] = true
                })
            }

            resource.addMethod(
                methodName,
                new LambdaIntegration(backingLambda, {
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
