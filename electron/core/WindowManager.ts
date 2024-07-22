import type { BrowserWindowConstructorOptions } from 'electron'
import { BrowserWindow } from 'electron'

interface IWindowOptions extends BrowserWindowConstructorOptions {
    isMain?: boolean
}

export class WindowManager {
    private windowMap: Map<number, BrowserWindow> = new Map()

    private mainWindowId?: number

    public get mainWindow () {
        return this.windowMap.get(this.mainWindowId!)
    }

    /* 创建一个窗口 */
    public create(options: IWindowOptions): BrowserWindow {
        const window = new BrowserWindow(options)
        this.windowMap.set(window.id, window)
        return window
    }

    /* 创建主窗口，主窗口只有一个 */
    public createMainWindow(options: IWindowOptions): BrowserWindow {
        if (this.mainWindowId && this.windowMap.has(this.mainWindowId)) {
            return this.windowMap.get(this.mainWindowId)!
        }
        const mainWindow = this.create(options)
        this.mainWindowId = mainWindow.id
        return mainWindow
    }
}