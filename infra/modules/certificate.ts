import {
    Certificate,
    DnsValidatedCertificate,
    CertificateValidation,
    DnsValidatedCertificateProps,
    ICertificate,
} from '@aws-cdk/aws-certificatemanager'
import { Stack } from '@aws-cdk/core'

interface props extends DnsValidatedCertificateProps {
    arn: string
}

const certificateModule = (
    scope: Stack,
    id: string,
    props: props
): ICertificate | DnsValidatedCertificate => {
    const { arn, hostedZone } = props
    try {
        const certificateModule = Certificate.fromCertificateArn(scope, id, arn)
        return certificateModule
    } catch (e) {
        const certificateModule = new DnsValidatedCertificate(scope, id, {
            ...props,
            validation: CertificateValidation.fromDns(hostedZone),
        })
        return certificateModule
    }
}

export default certificateModule
