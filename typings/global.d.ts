declare type IObj<T = string, U = any> = Record<T, U>

declare type UndefinedAble<T> = T | undefined

declare type Nullable<T> = T | null


declare interface Window {
    IpcRenderer: import('../electron/core/ipc').IIpcRendererProvider
}