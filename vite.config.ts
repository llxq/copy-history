import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { DevElectronBuild } from './plugins/electron-build.dev'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), DevElectronBuild()],
  base: './'
})
