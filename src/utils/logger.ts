export const logError = (...args: any) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(...args)
    }
}

export const logInfo = (...args: any) => {
    if (process.env.NODE_ENV === 'development') {
        console.info(...args)
    }
}
