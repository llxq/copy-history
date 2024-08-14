import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

export default {
    path: '/',
    name: 'Main',
    Component: lazy(() => import('./index')),
} as RouteObject