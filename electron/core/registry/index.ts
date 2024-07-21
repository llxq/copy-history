import type { BrowserWindow } from 'electron'

export const registryIpcHandlers = (windowInstance: BrowserWindow) => {
    console.log('输出了registry方法')
}