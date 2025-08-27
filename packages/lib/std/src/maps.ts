import {Func} from "./lang"

/** Utility helpers for working with `Map` and `WeakMap`. */
export class Maps {
    /**
     * Returns the value for `key` or creates and stores one via `factory`.
     */
    static createIfAbsent<K, V>(map: Map<K, V>, key: K, factory: Func<K, V>): V {
        let value = map.get(key)
        if (value === undefined) {
            value = factory(key)
            map.set(key, value)
        }
        return value
    }
}

/** Utilities specifically for `WeakMap`. */
export class WeakMaps {
    /** Returns the value for `key` or creates one if absent. */
    static createIfAbsent<K extends object, V>(map: WeakMap<K, V>, key: K, factory: Func<K, V>): V {
        let value = map.get(key)
        if (value === undefined) {
            value = factory(key)
            map.set(key, value)
        }
        return value
    }
}