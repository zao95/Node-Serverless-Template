import { Cors, EndpointType } from '@aws-cdk/aws-apigateway'
import { Code, Runtime } from '@aws-cdk/aws-lambda'
import { join } from 'path'
import { SubnetType } from '@aws-cdk/aws-ec2'
import { RetentionDays } from '@aws-cdk/aws-logs'

const setting = {
    construct: {
        key: 'cdkConstruct',
    },
    stack: {
        key: 'cdkStack',
    },
    logGroup: {
        cdkLogGroup: {
            key: 'cdkLogGroup',
            logGroupName: 'cdkLog',
        },
    },
    hostedZone: {
        cdkHostedZone: {
            key: 'cdkHostedZone',
            hostedZoneId: process.env.INFRA_ENV === 'production' ? '' : '',
            zoneName: 'howser.co.kr',
        },
    },
    certificate: {
        cdkCertificate: {
            key: 'cdkCertificate',
            arn: process.env.INFRA_ENV === 'production' ? '' : '',
            region: 'us-east-1',
            subDomain:
                process.env.INFRA_ENV === 'production' ? 'api' : 'dev.api',
        },
    },
    vpc: {
        cdkVpc: {
            key: 'cdkVpc',
            vpcId: '',
            cidr: '',
            natGateways: 0,
            subnetConfiguration: [
                {
                    cidrMask: 16,
                    name: '',
                    subnetType: SubnetType.PUBLIC,
                },
            ],
            routeTable: {
                key: 'cdkRoute',
            },
            peering: {
                key: 'cdkVpcPeeing',
                peerVpcId: process.env.INFRA_ENV === 'production' ? '' : '',
                destinationCidrBlock:
                    process.env.INFRA_ENV === 'production' ? '' : '',
                dnsKey: 'cdkVpcPeeingDns',
            },
            securityGroup: {
                key: 'cdkVpcSecurityGroup',
            },
        },
    },
    lambda: {
        commonFunctions: {
            key: 'commonFunctions',
            runtime: Runtime.NODEJS_14_X,
            allowPublicSubnet: true,
            logRetention: RetentionDays.TEN_YEARS,
            environment: {
                APP_ENV: process.env.INFRA_ENV,
            },
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
        },
        cdkHandler: {
            key: 'cdkHandler',
            runtime: Runtime.NODEJS_14_X,
            handler: 'entry.handler',
            code: Code.fromAsset(join(__dirname, '../dist')),
            allowPublicSubnet: true,
            logRetention: RetentionDays.TEN_YEARS,
            environment: {
                APP_ENV: process.env.INFRA_ENV,
            },
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
        },
    },
    apiGateway: {
        cdkApiGateway: {
            key: 'cdkApiGateway',
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'],
            },
            proxy: true,
            // endpointConfiguration: {
            //     types: [EndpointType.REGIONAL],
            // },
            domain: {
                key: 'cdkApiGatewayDomain',
            },
        },
        myTestApiGateway: {
            key: 'myTestApiGateway',
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'],
            },
            domain: {
                key: 'myTestApiGatewayDomain',
                domainName: {
                    endpointType: EndpointType.EDGE,
                },
            },
        },
    },
    route53: {
        aRecord: {
            cdkARecord: {
                key: 'cdkARecord',
            },
        },
    },
    envKR: {
        region: 'ap-northeast-2',
    },
}

export default setting
