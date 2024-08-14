import { useNotify } from '@/hooks/useNotify'
import type { RouteObject } from 'react-router-dom'
import { createHashRouter } from 'react-router-dom'

const { errorNotify } = useNotify()

const buildRoutes = (flatRoutes: Array<RouteObject>): Array<RouteObject> => {
    const length = flatRoutes.length
    if (length <= 1) {
        return flatRoutes
    }

    return flatRoutes
}

const getRoutes = (): Array<RouteObject> => {
    const flatRoutes: Array<RouteObject> = []
    try {
        const files = import.meta.glob('/src/pages/**/router.ts', { eager: true })
        const keys = Object.keys(files),
            length = keys.length
        for (let i = 0; i < length; ++i) {
            const key = keys[i]
            const module = Reflect.get(files, key) as { default: RouteObject }
            flatRoutes.push(module.default)
        }
    } catch (error: any) {
        errorNotify(error?.message || 'router 构建失败')
    }

    return buildRoutes(flatRoutes)
}

const routes: ReturnType<typeof createHashRouter> = createHashRouter(getRoutes())

export default routes