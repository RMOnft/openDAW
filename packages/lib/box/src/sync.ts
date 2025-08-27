/** Types supporting synchronization of box graphs. */
import {Nullish, UUID} from "@opendaw/lib-std"
import {AddressLayout} from "./address"

/**
 * Serialized operations used to synchronize graphs.
 */
export type UpdateTask<M> =
    | { type: "new", name: keyof M, uuid: UUID.Format, buffer: ArrayBufferLike }
    | { type: "update-primitive", address: AddressLayout, value: unknown }
    | { type: "update-pointer", address: AddressLayout, target: Nullish<AddressLayout> }
    | { type: "delete", uuid: UUID.Format }

/**
 * Interface implemented by communication layers that mirror graph updates.
 */
export interface Synchronization<M> {
    sendUpdates(updates: ReadonlyArray<UpdateTask<M>>): void
    checksum(value: Int8Array): Promise<void>
}