import { Construct, App } from '@aws-cdk/core'
import setting from './setting'
import CommonStack from './stacks/CommonStack'

interface props {
    swagger: any
}
class StackConstruct extends Construct {
    constructor(scope: App, id: string, props: props) {
        super(scope, id)

        const CommonStackObj = new CommonStack(scope, setting.stack.key, {
            env: setting.envKR,
            swagger: props.swagger,
        })

        // Module 1
        // const moduleOneStack = new ModulOneStack(
        //     scope,
        //     `module-one`,
        //     {
        //         apiGatewayRestApi: commonStack.apiGatewayRestApi
        //     }
        // );
        // Module 2, 3, etc.....

        // 스택 간 내부 데이터 옮길 때 사용하는 매개변수 interface
        // export interface CommonProps extends cdk.StackProps {
        //     apiGatewayRestApi: APIGATEWAY.RestApi;
        // }
    }
}

export default StackConstruct
