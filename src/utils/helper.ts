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

/**
 * Function to convert camelCase to snake_case
 */
export const camelToSnake = (camelStr: string): string => {
    return camelStr.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * Function to recursively convert object keys from camelCase to snake_case
 */
export const convertKeysToSnakeCase = (object: any): any => {
    if (Array.isArray(object)) {
        // handle array of objects
        return object.map((item) => convertKeysToSnakeCase(item))
    } else if (object !== null && typeof object === 'object') {
        return Object.keys(object).reduce((acc: any, key) => {
            const snakeKey = camelToSnake(key)
            // recursive conversion
            acc[snakeKey] = convertKeysToSnakeCase(object[key])
            return acc
        }, {})
    }
    return object
}
