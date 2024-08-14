export const getFormatCurrentTime = () =>  {
    const now = new Date()

    const options: Intl.DateTimeFormatOptions = {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24小时制
    }

    const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(now)

    // 将日期和时间分开，并格式化为所需的格式
    const [date, time] = formattedDate.split(' ')

    return `${ date.replace(/\//g, '-') } ${ time }`
}