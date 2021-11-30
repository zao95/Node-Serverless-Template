import {
    SecurityGroup,
    SecurityGroupProps,
    ISecurityGroup,
} from '@aws-cdk/aws-ec2'
import { Stack } from '@aws-cdk/core'

interface props extends SecurityGroupProps {
    securityGroupId?: string
}

const securityGroupModule = (
    scope: Stack,
    id: string,
    props?: props
): ISecurityGroup | SecurityGroup => {
    const { securityGroupId } = props
    try {
        const securityGroupModule = SecurityGroup.fromLookup(
            scope,
            id,
            securityGroupId
        )
        return securityGroupModule
    } catch (e) {
        const securityGroupModule = new SecurityGroup(scope, id, {
            ...props,
        })
        return securityGroupModule
    }
}

export default securityGroupModule
