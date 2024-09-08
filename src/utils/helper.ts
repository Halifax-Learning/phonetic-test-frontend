/**
 * Function to convert snake_case to camelCase
 */
export const snakeToCamel = (snakeStr: string): string => {
    return snakeStr.replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase())
}

/**
 * Function to recursively convert object keys from snake_case to camelCase
 */
export const convertKeysToCamelCase = (object: any): any => {
    if (Array.isArray(object)) {
        // handle array of objects
        return object.map((item) => convertKeysToCamelCase(item))
    } else if (object !== null && typeof object === 'object') {
        return Object.keys(object).reduce((acc: any, key) => {
            const camelKey = snakeToCamel(key)
            // recursive conversion
            acc[camelKey] = convertKeysToCamelCase(object[key])
            return acc
        }, {})
    }
    return object
}
