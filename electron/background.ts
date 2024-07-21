import { app, BrowserWindow } from 'electron'
import { registryIpcHandlers } from './core/registry'

const address = process.argv[2]

let minWindow: BrowserWindow
const createWindow = () => {
    minWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            preload: './electron-preload.js'
        }
    })

    if (address) {
        /* 获取传递的参数 */
        /* 获取 port and origin */
        minWindow.loadURL(address)
    } else {

    }

    minWindow.webContents.openDevTools({ mode: 'detach' })
}

app.whenReady().then(() => {
    createWindow()
    registryIpcHandlers(minWindow)
    minWindow.show()
})

