import { App, Stack, StackProps } from '@aws-cdk/core'
import { AllowVpcPeeringDnsResolution } from '../modules/allowVpcPeeringDnsResolution'
import { DomainName, EndpointType, RestApi } from '@aws-cdk/aws-apigateway'
import { RecordTarget } from '@aws-cdk/aws-route53'
import { ApiGatewayDomain } from '@aws-cdk/aws-route53-targets'
import { Peer, Port } from '@aws-cdk/aws-ec2'

import setting from '../setting'
import hostedZoneModule from '../modules/hostedZone'
import certificateModule from '../modules/certificate'
import lambdaRestApiModule from '../modules/lambdaRestApi'
import vpcModule from '../modules/vpc'
import vpcPeeringModule from './../modules/vpcPeering'
import lambdaModule from '../modules/lambda'
import route from '../modules/route'
import convertSwaggerToCdkRestApiModule from '../modules/convertSwaggerToCdkRestApi'
import aRecordModule from '../modules/aRecord'
import securityGroupModule from './../modules/securityGroup'

interface props extends StackProps {
    swagger: any
}
class CommonStack extends Stack {
    public constructor(scope: App, key: string, props?: props) {
        super(scope, key, props)

        const hostedZone = hostedZoneModule(
            this,
            setting.hostedZone.cdkHostedZone.key,
            {
                ...setting.hostedZone.cdkHostedZone,
            }
        )
        const certificate = certificateModule(
            this,
            setting.certificate.cdkCertificate.key,
            {
                ...setting.certificate.cdkCertificate,
                domainName: `${setting.certificate.cdkCertificate.subDomain}.${setting.hostedZone.cdkHostedZone.zoneName}`,
                hostedZone,
            }
        )
        const vpc = vpcModule(this, setting.vpc.cdkVpc.key, {
            ...setting.vpc.cdkVpc,
        })
        const vpcPeering = vpcPeeringModule(
            this,
            setting.vpc.cdkVpc.peering.key,
            {
                ...setting.vpc.cdkVpc.peering,
                vpcId: vpc.vpcId,
            }
        )
        new AllowVpcPeeringDnsResolution(
            this,
            setting.vpc.cdkVpc.peering.dnsKey,
            {
                vpcPeering,
            }
        )
        vpc.publicSubnets.forEach(({ routeTable: { routeTableId } }, idx) => {
            route(this, `${setting.vpc.cdkVpc.routeTable.key}_${idx}`, {
                destinationCidrBlock:
                    setting.vpc.cdkVpc.peering.destinationCidrBlock,
                routeTableId,
                vpcPeeringConnectionId: vpcPeering.ref,
            })
        })
        const securityGroup = securityGroupModule(
            this,
            setting.vpc.cdkVpc.securityGroup.key,
            { ...setting.vpc.cdkVpc.securityGroup, vpc }
        )
        securityGroup.addIngressRule(
            Peer.ipv4(setting.vpc.cdkVpc.peering.destinationCidrBlock),
            Port.allTcp(),
            'allow all access from the DB'
        )
        // const handler = lambdaModule(this, setting.lambda.cdkHandler.key, {
        //     ...setting.lambda.cdkHandler,
        //     vpc,
        // })
        // const apiGateway = lambdaRestApiModule(
        //     this,
        //     setting.apiGateway.cdkApiGateway.key,
        //     {
        //         ...setting.apiGateway.cdkApiGateway,
        //         handler,
        //     }
        // )
        // const aRecord = aRecordModule(
        //     this,
        //     setting.route53.aRecord.cdkARecord.key,
        //     {
        //         zone: hostedZone,
        //         recordName: `${setting.certificate.cdkCertificate.subDomain}.${setting.hostedZone.cdkHostedZone.zoneName}`,
        //         target: RecordTarget.fromAlias(
        //             new ApiGatewayDomain(
        //                 new DomainName(
        //                     this,
        //                     setting.apiGateway.cdkApiGateway.domain.key,
        //                     {
        //                         certificate,
        //                         domainName: `${setting.certificate.cdkCertificate.subDomain}.${setting.hostedZone.cdkHostedZone.zoneName}`,
        //                         endpointType: EndpointType.EDGE,
        //                         mapping: apiGateway,
        //                     }
        //                 )
        //             )
        //         ),
        //     }
        // )
        const testApiGateway = new RestApi(this, 'testCdkApiGateway', {
            restApiName: 'My_Test_API',
            ...setting.apiGateway.myTestApiGateway,
        })
        new ApiGatewayDomain(
            new DomainName(
                this,
                setting.apiGateway.myTestApiGateway.domain.key,
                {
                    ...setting.apiGateway.myTestApiGateway.domain,
                    certificate,
                    domainName: `${setting.certificate.cdkCertificate.subDomain}.${setting.hostedZone.cdkHostedZone.zoneName}`,
                    endpointType: EndpointType.EDGE,
                    mapping: testApiGateway,
                }
            )
        )
        convertSwaggerToCdkRestApiModule(this, testApiGateway, props.swagger, {
            ...setting.lambda.commonFunctions,
            vpc,
            securityGroups: [securityGroup],
        })
    }
}

export default CommonStack
