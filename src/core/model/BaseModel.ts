import { createUUID } from '@/utils'
import { ModelTypeEnum } from '@share/ModelTypeEnum'

export interface IBaseModelProps {
    id?: number
    /* 类型 */
    type: ModelTypeEnum
    /* 内容 */
    content: string
    /* 时间 */
    time: string
}

export abstract class BaseModel {
    public type: ModelTypeEnum
    public content: string
    public id: number
    public time: string

    constructor(props: IBaseModelProps) {
        this.type = props.type
        this.content = props.content
        this.id = props.id || createUUID()
        this.time = props.time
    }

    /* 展示的内容 */
    public abstract get showContent(): string | JSX.Element

    /* 实际的内容 */
    public abstract get realContent(): string | JSX.Element

    /* 复制的方法 */
    public abstract copy(): void

    /* 比较两个数据是不是相等 */
    public abstract compare(other: BaseModel | IBaseModelProps): boolean
}