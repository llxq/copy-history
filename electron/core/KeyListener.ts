import { clipboard } from 'electron'
import { GlobalKeyboardListener } from 'node-global-key-listener'
import { ModelTypeEnum } from '../../share/ModelTypeEnum'
import { debounce, getFormatCurrentTime } from './utils'

export interface IClipboardData {
    content: string
    type: ModelTypeEnum
    time: string
}

export class KeyListener {
    public static _instance: KeyListener
    public static getInstance() {
        if (!this._instance) {
            this._instance = new KeyListener()
        }
        return this._instance
    }

    constructor() {
        this.start()
    }

    private _keyboardListener: UndefinedAble<GlobalKeyboardListener>

    private _callbackList: Array<(data: IClipboardData) => void> = []

    private getData(): UndefinedAble<IClipboardData> {
        // const format = clipboard.availableFormats()
        // console.log(format, 'format')
        // 检查是否有图片
        const imageData = clipboard.readImage()
        if (!imageData.isEmpty()) {
            // const type = imageData.toBitmap()
            // return {
            //     content: imageData,
            // }
        }

        // 检查是否有文件
        const fileData = clipboard.readBuffer('file')
        if (fileData.length > 0) {
            // console.log('剪贴板中有文件')
            // return
        }

        // 检查是否有文本
        const textData = clipboard.readText()
        if (textData) {
            return {
                content: textData,
                type: ModelTypeEnum.TEXT,
                time: getFormatCurrentTime()
            }
        }
    }

    public start() {
        this.off()
        this._keyboardListener = new GlobalKeyboardListener()
        this._keyboardListener.addListener(debounce(() => {
            const data = this.getData()
            data && this._callbackList.forEach(callBack => {
                callBack(data)
            })
        }, 500))
    }

    public on(callBack: (data: IClipboardData) => void) {
        this._callbackList.push(callBack)
    }

    public off() {
        this._callbackList = []
        this._keyboardListener?.kill()
    }
}