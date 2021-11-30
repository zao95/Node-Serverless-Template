import { Stack } from '@aws-cdk/core'
import { ARecord, ARecordProps } from '@aws-cdk/aws-route53'

interface props extends ARecordProps {}

const aRecordModule = (scope: Stack, id: string, props: props): ARecord => {
    const aRecordModule = new ARecord(scope, id, {
        ...props,
    })
    return aRecordModule
}

export default aRecordModule

// public route53record = new ARecord(this, 'testARecord', {
//     zone: this.hostedZone,
//     recordName: setting.hostedZone.record,
//     target: RecordTarget.fromAlias(
//         new ApiGatewayDomain(
//             new DomainName(this, setting.apiGateway.domain.name, {
//                 certificate: this.certificate,
//                 domainName: `${setting.hostedZone.record}.${setting.hostedZone.domainName}`,
//                 endpointType: EndpointType.EDGE,
//                 mapping: this.cdkApiGateway,
//             })
//         )
//     ),
// })
