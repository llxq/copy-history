import react from '@vitejs/plugin-react'
import { join } from 'path'
import type { Plugin, PluginOption } from 'vite'
import { defineConfig } from 'vite'
import { DevElectronBuild } from './plugins/electron-build.dev'
import { PrdElectronBuild } from './plugins/electron-build.prd'

const plugins: Array<Plugin | PluginOption> = [react()]

if (process.env.NODE_ENV === 'production') {
    plugins.push(PrdElectronBuild())
} else {
    plugins.push(DevElectronBuild())
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins,
    base: './',
    resolve: {
        alias: {
            '@': join(__dirname, 'src'),
            '@share': join(__dirname, 'share'),
        }
    },
})
