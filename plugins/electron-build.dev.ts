import { spawn } from 'child_process'
import { watchFile } from 'fs'
import type { Plugin } from 'vite'
import { buildElectronEntry } from './utils/buildElectronEntry'

export function DevElectronBuild (): Plugin {
    return {
        name: 'dev-electron-build',
        configureServer (server) {
            buildElectronEntry()
            /* 监听 HTTP 服务器 启动，然后开启 electron 服务 */
            server.httpServer?.once('listening', () => {
                const addressInfo = server.httpServer?.address()
                if (addressInfo && typeof addressInfo === 'object') {
                    /* ipv6 拿不到具体的 ip 地址，所以默认写成 localhost */
                    const { port } = addressInfo
                    if (port) {
                        const address = `http://localhost:${ port }`

                        const createServer = () => {
                            return spawn('electron', ['dist/electron/background.js', address], {
                                cwd: process.cwd(),
                                stdio: 'inherit',
                            })
                        }

                        /* 启动一个 electron 服务 */
                        let app = createServer()
                        watchFile('electron/background.ts', () => {
                            app.kill()
                            buildElectronEntry()
                            app = createServer()
                        })

                        app.stderr?.on('data', data => {
                            console.log(data.tostring())
                        })
                    }
                }
            })
        }
    }
}