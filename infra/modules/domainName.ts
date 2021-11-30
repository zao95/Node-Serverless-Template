import {
    DomainName,
    DomainNameProps,
    IDomainName,
} from '@aws-cdk/aws-apigateway'
import { Stack } from '@aws-cdk/core'

interface props extends DomainNameProps {
    domainNameAliasHostedZoneId
    domainNameAliasTarget
}

const domainNameModule = (
    scope: Stack,
    id: string,
    props: props
): IDomainName | DomainName => {
    const {
        domainName,
        domainNameAliasHostedZoneId,
        domainNameAliasTarget,
    } = props
    try {
        const domainNameModule = DomainName.fromDomainNameAttributes(
            scope,
            id,
            {
                domainName,
                domainNameAliasHostedZoneId,
                domainNameAliasTarget,
            }
        )
        return domainNameModule
    } catch (e) {
        const domainNameModule = new DomainName(scope, id, {
            ...props,
        })
        return domainNameModule
    }
}

export default domainNameModule
