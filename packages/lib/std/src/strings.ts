import {isDefined, Nullish} from "./lang"

/** String manipulation helpers. */
export namespace Strings {
    /** Converts hyphenated text to camelCase. */
    export const hyphenToCamelCase = (value: string) => value
        .replace(/-([a-z])/g, (g: string) => g[1].toUpperCase())

    /** Returns {@link value} or {@link fallback} when the former is empty. */
    export const fallback = (value: Nullish<string>, fallback: string): string =>
        isDefined(value) && value.length > 0 ? value : fallback

    /** Checks whether {@link str} ends with a numeric digit. */
    export const endsWithDigit = (str: string): boolean => /\d$/.test(str)

    /** Ensures a trimmed, non-empty string by falling back if required. */
    export const nonEmpty = (str: Nullish<string>, fallback: string): string =>
        isDefined(str) && str.trim().length > 0 ? str : fallback

    /**
     * Encodes {@link str} as a UTF-8 byte array wrapped in an ArrayBuffer.
     */
    export const toArrayBuffer = (str: string): ArrayBuffer => {
        const buffer = new ArrayBuffer(str.length)
        const view = new Uint8Array(buffer)
        for (let i = 0; i < str.length; i++) {
            view[i] = str.charCodeAt(i)
        }
        return buffer
    }

    /**
     * Returns a unique name by appending a counter when {@link desiredName}
     * already exists within {@link existingNames}.
     */
    export const getUniqueName = (existingNames: ReadonlyArray<string>, desiredName: string): string => {
        const existingSet = new Set(existingNames)
        let test = desiredName
        let counter = 1
        if (existingSet.has(desiredName) || existingSet.has(`${desiredName} 1`)) {
            counter = 2
        } else {
            return desiredName
        }
        while (existingSet.has(test = `${desiredName} ${counter++}`)) {
            // continue searching for available name
        }
        return test
    }
}