import react from '@vitejs/plugin-react'
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
  base: './'
})
