export const debounce = <T extends (...args: Array<any>) => void>(fn: T, delay: number): (...args: Parameters<T>) => void => {
    let timer: UndefinedAble<NodeJS.Timeout>
    return function (...args: Parameters<T>): void {
        // @ts-ignore
        const context = this
        
        timer && clearTimeout(timer)

        timer = setTimeout(() => {
            fn.apply(context, args)
        }, delay)
    }
}