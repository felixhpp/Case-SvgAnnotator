export function cusAssert(condition: Boolean, message?: string) {
    if (condition === false) {
        throw Error('Assertion failed' + message ? ':' + message : '')
    }
}