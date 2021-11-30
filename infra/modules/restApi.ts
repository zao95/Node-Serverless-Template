import { RestApi, RestApiProps } from '@aws-cdk/aws-apigateway'
import { Stack } from '@aws-cdk/core'

interface props extends RestApiProps {}

const restApiModule = (scope: Stack, name: string, props: props): RestApi => {
    const restApiModule = new RestApi(scope, name, {
        ...props,
        // endpointTypes: [apigateway.EndpointType.PRIVATE], // vpc 내부에서 안부르면 거절하게끔 세팅
        // policy: new iam.PolicyDocument({
        //     statements: [
        //         new iam.PolicyStatement({
        //             principals: [new iam.AnyPrincipal],
        //             actions: ['execute-api:Invoke'],
        //             resources: ['execute-api:/*'],
        //             effect: iam.Effect.DENY,
        //             conditions: {
        //                 StringNotEquals: {
        //                 "aws:SourceVpce": vpcEndpoint.vpcEndpointId
        //                 }
        //             }
        //         }),
        //         new iam.PolicyStatement({
        //             principals: [new iam.AnyPrincipal],
        //             actions: ['execute-api:Invoke'],
        //             resources: ['execute-api:/*'],
        //             effect: iam.Effect.ALLOW
        //         })
        //     ]
        // })
    })
    return restApiModule
}

export default restApiModule
