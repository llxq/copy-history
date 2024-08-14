import type { BuildOptions } from 'vite'
import { build } from 'vite'

type IRollupOptions = BuildOptions['rollupOptions']

const prdOptions: Partial<IRollupOptions> = {
    output: {
        dir: 'dist',
        format: 'cjs', // 输出 CJS 模块
        entryFileNames: '[name].js',
    }
}

const devOptions: Partial<IRollupOptions> = {
    output: [
        {
            dir: 'dist',
            format: 'es',
            entryFileNames: chunkInfo => {
                /* es 不需要 preload.js */
                if (chunkInfo.name === 'preload') {
                    return '[name].excessive.js'
                }
                return '[name].js'
            },
        },
        {
            /* 因为 preload 不能使用esm。所以需要打包一个cjs的 */
            dir: 'dist',
            format: 'cjs',
            entryFileNames: chunkInfo => {
                /* cjs 不需要 background.js */
                if (chunkInfo.name === 'background') {
                    return '[name].excessive.js'
                }
                return '[name].js'
            },
        }
    ]
}

/* 通过 esbuild 打包ts */
export const buildElectronEntry = (isPrd?: boolean) => {

    const rollupOptions = isPrd ? prdOptions : devOptions

    const external = ['electron']
    if (!isPrd) {
        external.push('node-global-key-listener')
    } else {
        external.push('os', 'child_process', 'path', 'crypto', 'fs', 'util')
    }

    /**
     * 使用 vite 的 build 打包。esbuild 不让用了，所以直接使用 build
     * TODO：未删除多余的打包文件
     */
    return build({
        mode: 'production', // 确保是生产模式  
        configFile: false, // 不使用 vite.config.js  
        publicDir: false, // 不需要 public 文件
        build: {
            // prd 不清空
            emptyOutDir: !isPrd, // 清空输出目录  
            rollupOptions: {
                input: {
                    'background': 'electron/background.ts',
                    'preload': 'electron/core/preload.ts',
                }, // 打包electron的入口文件和preload文件  
                ...rollupOptions,
                plugins: [], // 可以添加 Rollup 插件  
                external,
            }
        },
        base: './',
    })
}