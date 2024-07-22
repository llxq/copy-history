import { app } from 'electron'
import { APP_NAME, styleConfig } from './configuration'
import { WindowManager } from './WindowManager'

export class Application {
    public static _instance: Application

    public static getInstance () {
        if (!this._instance) {
            this._instance = new Application()
        }
        return this._instance
    }

    public windowManager = new WindowManager()

    private mountApp (): void {
        const mainWindow = this.windowManager.createMainWindow({
            ...styleConfig,
            show: false,
            webPreferences: { 
                preload: './preload.js'
             }
        })

        /* 获取地址信息 */
        const address = process.argv[2]
        /**
         * 有则代表是开发环境
         * @see /plugins/electron-build.dev.ts
         */
        if (address) {
            mainWindow.loadURL(address)
            /* 开发环境默认打开调试工具 */
            mainWindow.webContents.openDevTools({ mode: 'detach' })
        } else {
            mainWindow.loadFile('index.html')
        }
        /* 打开窗口。因为窗口默认是关闭的 */
        mainWindow.show()
    }

    /* app 启动 */
    public launchApp (): void {
        /**
         * 只允许一个实例
         * @see https://www.electronjs.org/zh/docs/latest/api/app#%E4%BA%8B%E4%BB%B6-second-instance
         */
        const gotTheLock = app.requestSingleInstanceLock({ name: APP_NAME })
        if (!gotTheLock) {
            app.quit()
        }

        /* 开始挂载app */
        app.whenReady().then(() => {
            this.mountApp()
        })

        /* 处理打开第二个实例的时候 */
        app.on('second-instance', (_, __, ___, data) => {
            if ((data as IObj)?.name === APP_NAME) {
                /* 用户试图打开第二个实例。 */
                const mainWindow = this.windowManager.mainWindow
                if (mainWindow) {
                    /* 如果是最小化了，就恢复 */
                    if (mainWindow.isMinimized()) {
                        mainWindow.restore()
                    }
                    mainWindow.focus()
                }
            }
        })
    }
}