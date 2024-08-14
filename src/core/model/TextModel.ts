import type { IBaseModelProps } from '@/core/model/BaseModel'
import { BaseModel } from '@/core/model/BaseModel'

export class TextModel extends BaseModel {
    public get showContent(): string | JSX.Element {
        /* 展示的内容不展示换行符号 */
        return this.content.replace(/\n/g, '')
    }
    public get realContent(): string | JSX.Element {
        return this.content
            .replace(/ /g, '&nbsp;') // 替换所有空格为 &nbsp;
            .replace(/\n/g, '<br />') // 替换所有换行符为 <br />
    }
    public copy(): void {
        // TODO
    }

    public compare(other: BaseModel | IBaseModelProps): boolean {
        return this.content === other.content
    }
}