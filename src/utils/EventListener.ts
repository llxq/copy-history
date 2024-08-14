// 注意：分发事件需要注意取消。否则容易导致事件指数增加导致内存溢出
export interface IEventListenerOptions {
    immediate?: boolean // 是否立即执行
    isToString?: boolean // 是否掉用 toString 对比当前传递进来的方法
}

interface EventType {
    eventName: string | number
    params: any
    callbacks: Array<EventFnc>
}

interface EventFnc {
    (...args: any): void
}

export interface EventListenerProps {
    $on(eventName: string | number, callback: EventFnc, options?: Partial<IEventListenerOptions>): void

    $emit(eventName: string | number, ...args: any): void

    $off(eventName?: string | Array<string>): void

    $once(eventName: string | number, callback: EventFnc): void
}

export default class EventListener implements EventListenerProps {
    private _eventList: Array<EventType> = []

    // 重写toString方法
    private _toString = (callback: EventFnc): string => Object.toString.call(callback)

    /**
     * 监听
     * @param {string | number} eventName 需要监听的名字
     * @param {Function} callback 监听触发的回调
     * @param options
     * */
    public $on(eventName: string | number, callback: EventFnc, options?: Partial<IEventListenerOptions>): void {
        options = Object.assign({ toString: true, immediate: true }, options)
        const { isToString, immediate } = options
        const event: UndefinedAble<EventType> = this._findEvent(eventName)
        if (event) {
            // 不比较引用。通过方法字符串去对比callback
            const fnc: UndefinedAble<EventFnc> = event?.callbacks?.find((fnc: EventFnc) => {
                if (isToString) {
                    return this._toString(fnc) === this._toString(callback)
                }
                return fnc === callback
            })
            if (!fnc) {
                // 如果没有事件，需要往list中加一个
                event.callbacks.push(callback)
            }
            immediate && callback(...event.params)
        } else {
            // 如果没有事件，需要往list中加一个
            this._addEvent(eventName, '', [callback])
        }
    }

    /**
     * 分发事件
     * @param {string | number} eventName 需要分发的监听的名字
     * @param { any } args 传递的参数
     * */
    public $emit(eventName: string | number, ...args: any): Promise<void | void[]> {
        const event: UndefinedAble<EventType> = this._findEvent(eventName)
        if (event) {
            event.params = args
            return Promise.all(event.callbacks?.map((fnc: EventFnc) => fnc(...event.params)))
        } else {
            // 如果没有事件，需要往list中加一个
            this._addEvent(eventName, args)
        }
        return Promise.resolve()
    }

    /**
     * 取消监听
     * @param {string | number | Array<string | number>} eventName 需要取消的监听名称
     * */
    public $off(eventName?: string | number | Array<string | number>): void {
        if (typeof eventName !== 'object') {
            const index: number = this._eventList.findIndex((event: EventType) => event.eventName === eventName)
            if (index > -1) this._eventList.splice(index, 1)
        } else if (eventName instanceof Array) {
            eventName.map((m: string | number) => this.$off(m))
        } else {
            this._eventList = []
        }
    }

    public $offCallback(eventName: string | number, callback: EventFnc | Array<EventFnc>): void {
        if (callback instanceof Array) {
            callback.forEach(item => {
                this.$offCallback(eventName, item)
            })
        } else {
            const findEvent = this._eventList.find((it: EventType) => it.eventName === eventName)
            if (findEvent) {
                const fncIndex = findEvent.callbacks.findIndex((it: EventFnc) => this._toString(it) === this._toString(callback))
                if (fncIndex > -1) findEvent.callbacks.splice(fncIndex, 1)
            }
        }
    }

    /**
     * 执行一次的监听之后立即销毁
     * @param {string | number} eventName 需要监听的名字
     * @param {Function} callback 监听触发的回调
     * */
    public $once(eventName: string | number, callback: EventFnc): void {
        this.$emit(eventName, callback, true).then(() => {
            this.$off(eventName)
        })
    }

    private _findEvent(eventName: string | number): UndefinedAble<EventType> {
        return this._eventList.find((event: EventType) => event.eventName === eventName)
    }

    private _addEvent(eventName: string | number, params?: any, callbacks?: Array<EventFnc>): void {
        this._eventList.push({
            eventName,
            params: params ?? '',
            callbacks: callbacks ?? [],
        })
    }
}
