import { spawn } from 'child_process'
import chokidar from 'chokidar'
import { build } from 'electron-builder'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'
import { buildElectronEntry } from './buildElectronEntry'

const resolve = (path: string) => join(process.cwd(), path)

const getJson = (path: string) => JSON.parse(readFileSync(resolve(path), 'utf-8'))

/* 创建一个 electron 开发服务 */
export const createElectronDevServer = (address: string): void => {
    const createServer = () => {
        return spawn('electron', ['dist/background.js', address], {
            cwd: process.cwd(),
            stdio: 'inherit',
        })
    }

    /* 启动一个 electron 服务 */
    let app = createServer()

    const watcher = chokidar.watch('electron', {
        /* 使 watcher 永久监听 */
        persistent: true,
        /* 忽略初始化文件事件 */
        ignoreInitial: true,
    })

    /* 暂时只监听文件修改的动作 */
    watcher.on('change', path => {
        console.log('change', path)
        app.kill()
        buildElectronEntry()
        app = createServer()
    })

    app.stderr?.on('data', data => {
        console.log(data.tostring())
    })
}

/* 创建一个 electron 打包服务 */
export const createElectronBuildServer = () => {
    const releasePath = join(process.cwd(), 'release')
    if (existsSync(releasePath)) {
        /* 删除文件夹 */
        rmSync(releasePath, { recursive: true, force: true })
    }
    /* 为了防止没有执行过 dev 命令，直接跑 build 导致 electron 配置文件未打包 */
    buildElectronEntry(true).then(() => {
        /* 保证打包完之后执行。否则可能会导致 electron 配置文件未打包 */
        /* copy package.json 文件，并且增加信息 */
        const { version, auth } = getJson('package.json')
        const electronPackageJson = getJson('electron/package.json')
        Object.assign(electronPackageJson, {
            version,
            auth
        })
        writeFileSync('dist/package.json', JSON.stringify(electronPackageJson, null, 2), 'utf-8')
        const nodeModulesPath = join(process.cwd(), 'dist/node_modules')
        /* 增加一个文件夹，让 electron build 的时候不下载 */
        mkdirSync(nodeModulesPath, { recursive: true })
        return build({
            config: {
                directories: {
                    output: releasePath,
                    /* 那些内容需要打包到app内部 */
                    app: join(process.cwd(), 'dist')
                },
                files: ['**/*'],
                asar: false,
                appId: 'com.example.copyHistory', // 暂无appId
                productName: 'CopyHistory',
                nsis: {
                    /* 取消一键安装 */
                    oneClick: false,
                    /* 允许更改安装目录 */
                    allowToChangeInstallationDirectory: true,
                },
                mac: {
                    target: ['dmg'],
                    category: 'public.app-category.utilities'
                },
                win: {
                    target: ['nsis'],
                },
                linux: {
                    target: ['AppImage'],
                    category: 'Utility'
                },
            },
        }).then(() => {
            /* 打包完之后删除掉空的node_modules */
            rmSync(nodeModulesPath, { recursive: true, force: true })
            return Promise.resolve()
        })
    })
}