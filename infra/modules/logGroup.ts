import { LogGroup, LogGroupProps, ILogGroup } from '@aws-cdk/aws-logs'
import { Stack } from '@aws-cdk/core'

interface props extends LogGroupProps {}

const logGroupModule = (
    scope: Stack,
    id: string,
    props: props
): ILogGroup | LogGroup => {
    try {
        const logGroupModule = LogGroup.fromLogGroupName(
            scope,
            id,
            props.logGroupName
        )
        return logGroupModule
    } catch (e) {
        const logGroupModule = new LogGroup(scope, id, {
            ...props,
        })
        return logGroupModule
    }
}

export default logGroupModule
