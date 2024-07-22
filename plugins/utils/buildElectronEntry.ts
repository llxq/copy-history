import type { BuildOptions } from 'vite'
import { build } from 'vite'

const baseBuildOptions: BuildOptions = {
    emptyOutDir: true, // 清空输出目录  
    rollupOptions: {
        input: {
            'background': 'electron/background.ts',
            'preload': 'electron/core/preload.ts',
        }, // 打包electron的入口文件和preload文件  
        output: {
            dir: 'dist',
            format: 'es', // 输出 ES 模块
            entryFileNames: '[name].js',
        },
        plugins: [], // 可以添加 Rollup 插件  
        external: ['electron'],
    }
}

/* 通过 esbuild 打包ts */
export const buildElectronEntry = (isPrd?: boolean) => {
    const buildOptions: BuildOptions = {...baseBuildOptions}
    /* 生产使用 cjs */
    if (isPrd) {
        const output = buildOptions.rollupOptions!.output!
        /* 为了语法不报错 */
        if (!Array.isArray(output)) {
            output.format = 'cjs'
        }
        /* 生产不清空输出文件夹 */
        buildOptions.emptyOutDir = false
    }
    /* 使用 vite 的 build 打包。esbuild 不让用了，所以直接使用 build */
    return build({
        mode: 'production', // 确保是生产模式  
        configFile: false, // 不使用 vite.config.js  
        publicDir: false, // 不需要 public 文件
        build: buildOptions,
        base: './',
    })
}