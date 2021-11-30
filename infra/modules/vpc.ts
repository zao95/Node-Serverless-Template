import { Vpc, VpcProps, IVpc } from '@aws-cdk/aws-ec2'
import { Stack } from '@aws-cdk/core'

interface props extends VpcProps {
    vpcId?: string
}

const vpcModule = (scope: Stack, id: string, props?: props): IVpc | Vpc => {
    const { vpcId } = props
    try {
        if (vpcId) {
            const vpcModule = Vpc.fromLookup(scope, id, {
                vpcId,
            })
            return vpcModule
        } else {
            const vpcModule = Vpc.fromLookup(scope, id, {
                vpcName: `${scope.artifactId}/${id}`,
            })
            return vpcModule
        }
    } catch (e) {
        const vpcModule = new Vpc(scope, id, {
            ...props,
        })
        return vpcModule
    }
}

export default vpcModule
