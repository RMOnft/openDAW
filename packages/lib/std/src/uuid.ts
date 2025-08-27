import {Arrays} from "./arrays"
import {assert, Comparator, Func, int, panic} from "./lang"
import {SortedSet} from "./sorted-set"
import {DataInput, DataOutput} from "./data"
import {Crypto} from "./crypto"
import {Maps} from "./maps"

declare const crypto: Crypto

/** Utility helpers for working with UUIDv4 values. */
export namespace UUID {
    /** 16‑byte binary UUID representation. */
    export type Format = Readonly<Uint8Array>
    /** Hyphenated string UUID representation. */
    export type String = `${string}-${string}-${string}-${string}-${string}`

    /** Length of a UUID in bytes. */
    export const length = 16 as const

    /**
     * Generates a random UUID using {@link crypto.getRandomValues}.
     */
    export const generate = (): Format => {
        return fromUint8Array(crypto.getRandomValues(new Uint8Array(length)))
    }

    /**
     * Hashes an `ArrayBuffer` and returns the first 16 bytes as a UUID.
     * @param buffer Data to hash with SHA‑256.
     */
    export const sha256 = async (buffer: ArrayBuffer): Promise<Format> => {
        const isVitest = typeof process !== "undefined" && process.env?.VITEST === "true"
        return crypto.subtle.digest("SHA-256", isVitest ? new Uint8Array(buffer.slice(0)) : buffer)
            .then(buffer => fromUint8Array(new Uint8Array(buffer.slice(0, length))))
    }

    /** Validates that the given value is a proper UUID. */
    export const validate = (uuid: UUID.Format): UUID.Format => UUID.parse(UUID.toString(uuid))

    /** Reads a UUID from a binary {@link DataInput}. */
    export const fromDataInput = (input: DataInput): Format => {
        const arr = new Uint8Array(length)
        input.readBytes(new Int8Array(arr.buffer))
        return arr
    }

    /** Writes a UUID to a {@link DataOutput}. */
    export const toDataOutput = (output: DataOutput, uuid: UUID.Format): void =>
        output.writeBytes(new Int8Array(uuid.buffer))

    /** Converts a UUID into its canonical string representation. */
    export const toString = (format: Format): string => {
        const hex: string[] = Arrays.create(index => (index + 0x100).toString(16).substring(1), 256)
        return hex[format[0]] + hex[format[1]] +
            hex[format[2]] + hex[format[3]] + "-" +
            hex[format[4]] + hex[format[5]] + "-" +
            hex[format[6]] + hex[format[7]] + "-" +
            hex[format[8]] + hex[format[9]] + "-" +
            hex[format[10]] + hex[format[11]] +
            hex[format[12]] + hex[format[13]] +
            hex[format[14]] + hex[format[15]]
    }

    /** Parses a UUID string into its binary representation. */
    export const parse = (string: string): Uint8Array => {
        const cleanUuid = string.replace(/-/g, "").toLowerCase()
        if (cleanUuid.length !== 32) {
            return panic("Invalid UUID format")
        }
        const bytes = new Uint8Array(length)
        for (let i = 0, j = 0; i < 32; i += 2, j++) {
            bytes[j] = parseInt(cleanUuid.slice(i, i + 2), 16)
        }
        return bytes
    }

    /** Comparator for ordering UUIDs lexicographically. */
    export const Comparator: Comparator<Format> = (a: Format, b: Format): int => {
        if (a.length !== length || b.length !== length) {
            return panic("Unexpected array length for uuid(v4)")
        }
        for (let i: int = 0; i < length; i++) {
            const delta: int = a[i] - b[i]
            if (delta !== 0) {return delta}
        }
        return 0
    }

    /** Convenience equality check for two UUIDs. */
    export const equals = (a: UUID.Format, b: UUID.Format): boolean => Comparator(a, b) === 0

    /** Constructs a {@link SortedSet} keyed by UUID. */
    export const newSet = <T>(key: Func<T, Format>) => new SortedSet<Format, T>(key, Comparator)

    /** Lowest possible UUID value. */
    export const Lowest: Format = parse("00000000-0000-4000-8000-000000000000")
    /** Highest possible UUID value. */
    export const Highest: Format = parse("FFFFFFFF-FFFF-4FFF-BFFF-FFFFFFFFFFFF")
    /** Creates a UUID from a 32‑bit integer. */
    export const fromInt = (value: int): Format => {
        const result = new Uint8Array(Lowest)
        const array = new Uint8Array(new Uint32Array([value]).buffer)
        for (let i = 0; i < 4; i++) {
            result[i] = array[i]
        }
        return result
    }

    /** Simple helper to map string ids to UUIDs on demand. */
    export class SimpleIdDecoder {
        readonly #uuids: Map<string, UUID.Format>
        constructor() {this.#uuids = new Map<string, UUID.Format>()}
        getOrCreate(id: string): UUID.Format {return Maps.createIfAbsent(this.#uuids, id, () => UUID.generate())}
    }

    const fromUint8Array = (arr: Uint8Array): Uint8Array => {
        assert(arr.length === length, "UUID must be 16 bytes long")
        arr[6] = (arr[6] & 0x0f) | 0x40 // Version 4 (random)
        arr[8] = (arr[8] & 0x3f) | 0x80 // Variant 10xx for UUID
        return arr
    }
}