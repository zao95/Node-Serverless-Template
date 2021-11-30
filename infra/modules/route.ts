import { CfnRouteProps, CfnRoute } from '@aws-cdk/aws-ec2'
import { Stack } from '@aws-cdk/core'

interface props extends CfnRouteProps {}

const routeModule = (scope: Stack, id: string, props: props): CfnRoute => {
    try {
        const routeModule = new CfnRoute(scope, id, {
            ...props,
        })
        return routeModule
    } catch (e) {
        console.log(e)
    }
}

export default routeModule
