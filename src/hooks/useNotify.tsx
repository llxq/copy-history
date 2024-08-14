import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons'
import { notification } from 'antd'
import type { ArgsProps } from 'antd/es/notification/interface'

/**
 * 统一的通知hooks
 * @returns 
 */
export const useNotify = () => {
    const notify = (options: ArgsProps): void => {
        notification.open(options)
    }

    const infoNotify = (description: string, argOptions?: ArgsProps): void => {
        const options = Object.assign({ description, message: '温馨提示', icon: <InfoCircleFilled style={{
            color: 'var(--primary-color)'
        }} /> }, argOptions ?? {}) as ArgsProps
        notify(options)
    }

    const successNotify = (description: string, argOptions?: ArgsProps): void => {
        const options = Object.assign({ description, message: '成功提示', icon: <CheckCircleFilled style={{
            color: 'var(--success-color)'
        }} /> }, argOptions ?? {}) as ArgsProps
        notify(options)
    }

    const errorNotify = (description: string, argOptions?: ArgsProps): void => {
        const options = Object.assign({
            description, message: '错误提示', icon: <CloseCircleFilled style={{
                color: 'var(--error-color)'
            }} />
        }, argOptions ?? {}) as ArgsProps
        notify(options)
    }

    return {
        notify,
        infoNotify,
        successNotify,
        errorNotify,
    }
}