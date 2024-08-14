import type { IBaseModelProps } from '@/core/model/BaseModel'
import { BaseModel } from '@/core/model/BaseModel'
import { TextModel } from '@/core/model/TextModel'
import { ModelTypeEnum } from '@share/ModelTypeEnum'

export const createModelFactory = <T extends BaseModel, U extends IBaseModelProps>(props: U): T => {
    const type = props.type

    switch (type) {
        case ModelTypeEnum.TEXT:
            return new TextModel(props) as T
    }

    throw new Error(`${ type } is not support`)
}