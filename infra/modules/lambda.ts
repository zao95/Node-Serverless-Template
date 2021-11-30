import { Function, FunctionProps } from '@aws-cdk/aws-lambda'
import { Stack } from '@aws-cdk/core'

interface props extends FunctionProps {}

const lambdaModule = (scope: Stack, name: string, props: props): Function => {
    const lambdaModule = new Function(scope, name, {
        ...props,
    })

    return lambdaModule
}

export default lambdaModule
