import { LambdaRestApi, LambdaRestApiProps } from '@aws-cdk/aws-apigateway'
import { Stack } from '@aws-cdk/core'

interface props extends LambdaRestApiProps {}

const lambdaRestApiModule = (
    scope: Stack,
    name: string,
    props: props
): LambdaRestApi => {
    const lambdaRestApiModule = new LambdaRestApi(scope, name, {
        ...props,
    })
    return lambdaRestApiModule
}

export default lambdaRestApiModule
