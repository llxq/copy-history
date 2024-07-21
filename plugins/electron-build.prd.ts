import type { Plugin } from 'vite'

export function prdElectronBuild(): Plugin {
    return {
        name: 'prd-electron-build',
    }
}