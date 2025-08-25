import { CLASSNAME_PREFIX } from '../constants'

export function normalizeClassName(className?: string | string[]) {
    if (!className) {
        return ''
    }
    if (Array.isArray(className)) {
        return className.map((item) => `${CLASSNAME_PREFIX}${item}`).join(' ')
    }
    return `${CLASSNAME_PREFIX}${className}`
}
