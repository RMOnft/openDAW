import {panic} from "./lang"

/** Convenience utilities for plain JavaScript objects. */
export namespace Objects {
    /** Type ensuring two object types share no overlapping keys. */
    export type Disjoint<U, V> = keyof U & keyof V extends never ? V : never

    /**
     * Merges two objects while asserting that their keys do not overlap.
     * @throws if a key exists in both objects.
     */
    export const mergeNoOverlap = <U extends {}, V extends {}>(u: U, v: Disjoint<U, V>): U & V => {
        const keys = new Set(Object.keys(u))
        for (const key of Object.keys(v)) {
            if (keys.has(key)) {
                return panic(`'${key}' is an overlapping key`)
            }
        }
        return ({...u, ...v}) as U & V
    }

    /** Picks only the specified keys from an object. */
    export const include = <T extends {}>(obj: T, ...keys: Array<keyof T>): Partial<T> =>
        keys.reduce((result: Partial<T>, key) => {
            result[key] = obj[key]
            return result
        }, {})

    /** Returns a copy of `obj` without the specified keys. */
    export const exclude = <T extends {}, K extends keyof T>(obj: T, ...keys: Array<K>): Omit<T, K> => {
        const exclude = new Set<keyof T>(keys)
        return Object.entries(obj).reduce((result: any, [key, value]) => {
            if (!exclude.has(key as keyof T)) {
                result[key] = value
            }
            return result
        }, {}) as Omit<T, K>
    }

    /** Mutates target by shallow‑merging the patch object. */
    export const overwrite = <T extends {}>(target: T, patch: Partial<T>): T => Object.assign(target, patch)
}