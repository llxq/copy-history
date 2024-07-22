import type { Plugin } from 'vite'
import { buildElectronEntry } from './utils/buildElectronEntry'
import { createElectronDevServer } from './utils/createElectronServer'

export function DevElectronBuild (): Plugin {
    return {
        name: 'dev-electron-build',
        configureServer (server) {
            buildElectronEntry()
            /* 监听 HTTP 服务器 启动，然后开启 electron 服务 */
            server.httpServer?.once('listening', () => {
                const addressInfo = server.httpServer?.address()
                if (addressInfo && typeof addressInfo === 'object') {
                    const { port } = addressInfo
                    /* ipv6 拿不到具体的 ip 地址，所以默认写成 localhost */
                    port && createElectronDevServer(`http://localhost:${ port }`)
                }
            })
        }
    }
}