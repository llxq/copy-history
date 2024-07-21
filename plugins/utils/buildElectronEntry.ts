import type { BuildOptions } from 'vite'
import { build } from 'vite'

const baseBuildOptions: BuildOptions = {
    emptyOutDir: true, // 清空输出目录  
    rollupOptions: {
        input: {
            'background': 'electron/background.ts',
            'preload': 'electron/core/preload/index.ts',
        }, // 打包electron的入口文件和preload文件  
        output: {
            dir: 'dist/electron',
            format: 'es', // 输出 ES 模块
            entryFileNames: '[name].js',
        },
        plugins: [], // 可以添加 Rollup 插件  
        external: ['electron'],
    }
}

/* 通过 esbuild 打包ts */
export const buildElectronEntry = (isProd?:boolean) => {
    /* 使用 vite 内置的 esbuild，就不在另行安装了 */
    build({
        mode: 'production', // 确保是生产模式  
        configFile: false, // 不使用 vite.config.js  
        publicDir: false, // 不需要 public 文件
        build: baseBuildOptions,
        base: './',
    })
}