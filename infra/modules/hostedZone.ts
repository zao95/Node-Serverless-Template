import {
    HostedZone,
    PublicHostedZone,
    PublicHostedZoneProps,
    IHostedZone,
} from '@aws-cdk/aws-route53'

interface props extends PublicHostedZoneProps {
    hostedZoneId: string
}

const hostedZoneModule = (
    scope,
    id: string,
    props: props
): IHostedZone | PublicHostedZone => {
    const { hostedZoneId, zoneName } = props
    try {
        const hostedZoneModule = HostedZone.fromHostedZoneAttributes(
            scope,
            id,
            {
                hostedZoneId,
                zoneName,
            }
        )
        return hostedZoneModule
    } catch (e) {
        const hostedZoneModule = new PublicHostedZone(scope, id, {
            ...props,
        })
        return hostedZoneModule
    }
}

export default hostedZoneModule
