import { Construct } from '@aws-cdk/core'
import { CfnVPCPeeringConnection } from '@aws-cdk/aws-ec2'
import { PolicyStatement, Effect } from '@aws-cdk/aws-iam'
import {
    AwsCustomResource,
    AwsCustomResourcePolicy,
    AwsSdkCall,
    PhysicalResourceId,
} from '@aws-cdk/custom-resources'
import { RetentionDays } from '@aws-cdk/aws-logs'

export interface AllowVpcPeeringDnsResolutionProps {
    vpcPeering: CfnVPCPeeringConnection
}

export class AllowVpcPeeringDnsResolution extends Construct {
    constructor(
        scope: Construct,
        id: string,
        props: AllowVpcPeeringDnsResolutionProps
    ) {
        super(scope, id)

        const onCreate: AwsSdkCall = {
            service: 'EC2',
            action: 'modifyVpcPeeringConnectionOptions',
            parameters: {
                VpcPeeringConnectionId: props.vpcPeering.ref,
                AccepterPeeringConnectionOptions: {
                    AllowDnsResolutionFromRemoteVpc: true,
                },
                RequesterPeeringConnectionOptions: {
                    AllowDnsResolutionFromRemoteVpc: true,
                },
            },
            physicalResourceId: PhysicalResourceId.of(
                `allowVpcPeeringDnsResolution:${props.vpcPeering.ref}`
            ),
        }
        const onUpdate = onCreate
        const onDelete: AwsSdkCall = {
            service: 'EC2',
            action: 'modifyVpcPeeringConnectionOptions',
            parameters: {
                VpcPeeringConnectionId: props.vpcPeering.ref,
                AccepterPeeringConnectionOptions: {
                    AllowDnsResolutionFromRemoteVpc: false,
                },
                RequesterPeeringConnectionOptions: {
                    AllowDnsResolutionFromRemoteVpc: false,
                },
            },
        }

        const customResource = new AwsCustomResource(
            this,
            'allow-peering-dns-resolution',
            {
                policy: AwsCustomResourcePolicy.fromStatements([
                    new PolicyStatement({
                        effect: Effect.ALLOW,
                        resources: ['*'],
                        actions: ['ec2:ModifyVpcPeeringConnectionOptions'],
                    }),
                ]),
                logRetention: RetentionDays.ONE_DAY,
                onCreate,
                onUpdate,
                onDelete,
            }
        )

        customResource.node.addDependency(props.vpcPeering)
    }
}
