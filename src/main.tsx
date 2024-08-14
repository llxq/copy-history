import '@/assets/styles/index.scss'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ConfigProvider locale={ zhCN }>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </ConfigProvider>
)
