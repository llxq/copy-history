import { ipcRenderer } from 'electron'
import type { IpcEventEnum } from '../../share/IpcEventEnum'
import { IClipboardData } from './KeyListener'

export const IpcRendererProvider = {
    receive: (channel: IpcEventEnum, listener: (data: IClipboardData) => void) => ipcRenderer.on(channel, (_, data) => listener(data)),
    refresh: () => ipcRenderer.invoke('refresh'),
    pasteData: (data: IClipboardData) => ipcRenderer.invoke('paste', data)
}

export type IIpcRendererProvider = typeof IpcRendererProvider