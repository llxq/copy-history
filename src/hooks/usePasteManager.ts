import { EventTypeEnum } from '@/core/enum/EventTypeEnum'
import { BaseModel } from '@/core/model/BaseModel'
import { IEventListenerParams, PasteManager } from '@/core/PasteManager'
import { useCallback, useEffect, useState } from 'react'

export const usePasteManager = () => {
    const pasteManager = PasteManager.getInstance()

    const [list, setList] = useState<Array<BaseModel>>(pasteManager.list)

    const [activeModel, setActiveModel] = useState<Nullable<BaseModel>>(null)

    const updateList = useCallback(({ list }: IEventListenerParams) => {
        setList(list)
    }, [])

    const updateActiveModel = useCallback((data: Partial<IEventListenerParams>) => {
        data?.activeModel && data.activeModel.id !== activeModel?.id && setActiveModel(data?.activeModel)
    }, [])

    useEffect(() => {
        pasteManager.eventListener.$on(EventTypeEnum.LIST_UPDATE, updateList, { immediate: false })
        pasteManager.eventListener.$on(EventTypeEnum.UPDATE_ACTIVE, updateActiveModel)
        return () => {
            pasteManager.eventListener.$offCallback(EventTypeEnum.LIST_UPDATE, updateList)
            pasteManager.eventListener.$offCallback(EventTypeEnum.UPDATE_ACTIVE, updateActiveModel)
        }
    }, [])

    return {
        list,
        activeModel,
        updateActiveModel,
    }
}