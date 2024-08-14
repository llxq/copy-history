import { contextBridge } from 'electron'
import { IpcRendererProvider } from './ipc'

contextBridge.exposeInMainWorld('IpcRenderer', IpcRendererProvider)
