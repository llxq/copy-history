import type { Plugin } from 'vite'
import { createElectronBuildServer } from './utils/createElectronServer'

export function PrdElectronBuild(): Plugin {
    return {
        name: 'prd-electron-build',
        closeBundle () {
            /* 开始打包 */
            createElectronBuildServer()
        }
    }
}