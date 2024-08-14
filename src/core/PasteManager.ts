import { createModelFactory } from '@/core/common/createModelFactory'
import { EventTypeEnum } from '@/core/enum/EventTypeEnum'
import type { BaseModel, IBaseModelProps } from '@/core/model/BaseModel'
import EventListener from '@/utils/EventListener'

export interface IEventListenerParams<T extends BaseModel = BaseModel> {
    list: Array<T>
    activeModel: Nullable<BaseModel>
}

export class PasteManager {
    static #instance: PasteManager

    public static getInstance(): PasteManager {
        if (!this.#instance) {
            this.#instance = new PasteManager()
        }
        return this.#instance
    }

    #list: Array<BaseModel> = []

    public get list() {
        return [...this.#list]
    }

    #eventListener = new EventListener()

    public get eventListener() {
        return this.#eventListener
    }

    #activeModel: Nullable<BaseModel> = null

    public get activeModel() {
        return this.#activeModel
    }

    #sendListener(eventName: EventTypeEnum, isUpdate = true): void {
        this.#eventListener.$emit(eventName, { list: this.list, activeModel: this.activeModel })
        isUpdate && this.#eventListener.$emit(EventTypeEnum.LIST_UPDATE, { list: this.list })
    }

    #findByData<T extends BaseModel, U extends IBaseModelProps>(props: U): T {
        return this.#list.find(item => item.compare(props as unknown as BaseModel)) as T
    }

    public updateActiveModel<T extends BaseModel>(model: T): T {
        this.#activeModel = model
        this.#sendListener(EventTypeEnum.UPDATE_ACTIVE, false)
        return this.#activeModel as T
    }

    public findIndexById(id: number): number {
        return this.#list.findIndex(item => item.id === id)
    }

    public findById<T extends BaseModel>(id: number): UndefinedAble<T> {
        return this.#list.find(item => item.id === id) as UndefinedAble<T>
    }

    public create<T extends BaseModel, U extends IBaseModelProps>(props: U): T {
        const findData = this.#findByData<T, U>(props)
        /* 如果找到的这个数据不是第一个那就放到第一个咯 */
        if (findData) {
            if (this.#list[0].id !== findData.id) {
                const index = this.findIndexById(findData.id)
                this.#list.splice(index, 1)
                this.#list.unshift(findData)
                this.#sendListener(EventTypeEnum.UPDATE_ACTIVE)
            }
            return findData
        }
        const newModel = createModelFactory<T, U>(props)
        return this.add(newModel)
    }

    public add<T extends BaseModel>(data: T): T {
        this.#list.unshift(data)
        this.#sendListener(EventTypeEnum.ADD)
        return data
    }

    public deleteById<T extends BaseModel>(id: number): UndefinedAble<T> {
        const index = this.findIndexById(id)
        if (index > -1) {
            const originData = this.#list[index]
            this.#sendListener(EventTypeEnum.DELETE)
            return originData as UndefinedAble<T>
        }
    }

    public getPasteData() {
        return navigator.clipboard.readText()
    }
}