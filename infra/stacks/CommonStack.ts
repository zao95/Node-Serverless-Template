import { App, Stack, StackProps } from '@aws-cdk/core'
import {
    Cors,
    EndpointType,
    MethodLoggingLevel,
    RestApi,
} from '@aws-cdk/aws-apigateway'
import convertSwaggerToCdkRestApiModule from '../modules/convertSwaggerToCdkRestApi'
import { Runtime } from '@aws-cdk/aws-lambda'
import { RetentionDays } from '@aws-cdk/aws-logs'
import { SubnetType } from '@aws-cdk/aws-ec2'

interface props extends StackProps {
    swagger: any
}
class CommonStack extends Stack {
    public constructor(scope: App, key: string, props?: props) {
        super(scope, key, props)

        const slipyApiGateway = new RestApi(this, 'slipyCdkApiGateway', {
            restApiName: 'Slipy_API_Gataway',
            description: 'slipy api gateways',
            endpointTypes: [EndpointType.REGIONAL],
            failOnWarnings: true, // Rollback when error on deploy process
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'],
            },
            deployOptions: {
                stageName: process.env.INFRA_ENV,
                description: `stage in ${process.env.INFRA_ENV} environment`,
                variables: {
                    APP_ENV: process.env.INFRA_ENV,
                },
                tracingEnabled: true, // X-Ray enable
                dataTraceEnabled: true, // CloudWatch log enable
                loggingLevel: MethodLoggingLevel.INFO, // CloudWatch logging level
                throttlingBurstLimit: 10, // maximum process count at same time
                throttlingRateLimit: 10, // maximum request count per second
            },
        })
        convertSwaggerToCdkRestApiModule(this, slipyApiGateway, props.swagger, {
            key: 'slipyFunctions',
            runtime: Runtime.NODEJS_14_X,
            allowPublicSubnet: true,
            logRetention: RetentionDays.TEN_YEARS,
            environment: {
                APP_ENV: process.env.INFRA_ENV,
            },
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
            // vpc,
            // securityGroups: [securityGroup],
        })
    }
}

export default CommonStack
