import {
    CfnVPCPeeringConnection,
    CfnVPCPeeringConnectionProps,
} from '@aws-cdk/aws-ec2'
import { Stack } from '@aws-cdk/core'

interface props extends CfnVPCPeeringConnectionProps {}

const vpcPeeringModule = (
    scope: Stack,
    id: string,
    props: props
): CfnVPCPeeringConnection => {
    const vpcPeeringModule = new CfnVPCPeeringConnection(scope, id, {
        ...props,
    })
    return vpcPeeringModule
}

export default vpcPeeringModule
