import {
    Arrays,
    assert,
    ByteArrayOutput,
    Exec,
    float,
    int,
    nextPowOf2,
    Option,
    Provider,
    Terminable
} from "@opendaw/lib-std"
import {Address} from "@opendaw/lib-box"
import {Communicator, Messenger} from "@opendaw/lib-runtime"
import {Lock} from "./Lock"
import {PackageType} from "./PackageType"
import {Protocol} from "./Protocol"
import {Flags} from "./Flags"

interface Package {
    readonly address: Address
    readonly type: PackageType
    readonly capacity: int
    put(output: ByteArrayOutput): void
}

/**
 * Serialises values provided by various publishers into a shared buffer and
 * forwards updates to a {@link LiveStreamReceiver}. The broadcaster owns the
 * data buffer and controls when receivers may read from it by toggling a
 * shared {@link Lock}.
 */
export class LiveStreamBroadcaster {
    /**
     * Creates a broadcaster backed by a named messenger channel.
     */
    static create(messenger: Messenger, name: string): LiveStreamBroadcaster {
        return new LiveStreamBroadcaster(messenger.channel(name))
    }

    readonly #packages: Array<Package> = []
    readonly #lock = new SharedArrayBuffer(1)
    readonly #lockArray = new Int8Array(this.#lock)
    readonly #sender: Protocol

    #output: ByteArrayOutput = ByteArrayOutput.create(0)
    #sabOption: Option<ArrayBufferLike> = Option.None
    #availableUpdate: Option<ArrayBufferLike> = Option.None

    #version: int = -1
    #capacity: int = -1
    #invalid: boolean = false
    #lockShared = false

    private constructor(messenger: Messenger) {
        this.#sender = Communicator.sender<Protocol>(messenger, ({dispatchAndForget}) =>
            new class implements Protocol {
                sendShareLock(lock: SharedArrayBuffer): void {dispatchAndForget(this.sendShareLock, lock)}
                sendUpdateData(buffer: ArrayBufferLike): void {dispatchAndForget(this.sendUpdateData, buffer)}
                sendUpdateStructure(buffer: ArrayBufferLike): void {dispatchAndForget(this.sendUpdateStructure, buffer)}
            })
    }

    /**
     * Flushes the pending packages into the shared buffer. When the structure
     * changes, the receiver is first notified with a new layout description and
     * data buffer. Actual values are written only when the consumer signals that
     * it is ready by setting the {@link Lock} to {@link Lock.WRITE}.
     */
    flush(): void {
        const update = this.#updateAvailable()
        if (update.nonEmpty()) {
            if (!this.#lockShared) {
                this.#sender.sendShareLock(this.#lock)
                this.#lockShared = true
            }
            this.#sender.sendUpdateStructure(update.unwrap())
            const capacity = this.#computeCapacity()
            if (this.#output.remaining < capacity) {
                const size = nextPowOf2(capacity)
                const data = new SharedArrayBuffer(size)
                this.#output = ByteArrayOutput.use(data)
                this.#sabOption = Option.wrap(data)
                this.#sender.sendUpdateData(data)
            }
        }
        if (this.#sabOption.isEmpty()) {return}
        // If main-thread is not interested, no data will ever be sent again,
        // since it will not set the lock to CAN_WRITE. No lock is necessary since
        // the other side skips reading until we set the lock to CAN_READ.
        if (Atomics.load(this.#lockArray, 0) === Lock.WRITE) {
            this.#flushData(this.#output)
            this.#output.position = 0
            Atomics.store(this.#lockArray, 0, Lock.READ)
        }
    }

    /** Registers a float provider to be broadcast on each flush. */
    broadcastFloat(address: Address, provider: Provider<float>): Terminable {
        return this.#storeChunk(new class implements Package {
            readonly type: PackageType = PackageType.Float
            readonly address: Address = address
            readonly capacity: number = 8
            put(output: ByteArrayOutput): void {output.writeFloat(provider())}
        })
    }

    /** Registers an integer provider to be broadcast on each flush. */
    broadcastInteger(address: Address, provider: Provider<int>): Terminable {
        return this.#storeChunk(new class implements Package {
            readonly type: PackageType = PackageType.Integer
            readonly address: Address = address
            readonly capacity: number = 8
            put(output: ByteArrayOutput): void {output.writeInt(provider())}
        })
    }

    /** Broadcasts a `Float32Array` after invoking the supplied update hook. */
    broadcastFloats(address: Address, values: Float32Array, update: Exec): Terminable {
        return this.#storeChunk(new class implements Package {
            readonly type: PackageType = PackageType.FloatArray
            readonly address: Address = address
            readonly capacity: number = 4 + (values.byteLength << 2)
            put(output: ByteArrayOutput): void {
                update()
                output.writeInt(values.length)
                for (const value of values) {output.writeFloat(value)}
            }
        })
    }

    /** Broadcasts an `Int32Array` after invoking the supplied update hook. */
    broadcastIntegers(address: Address, values: Int32Array, update: Exec): Terminable {
        return this.#storeChunk(new class implements Package {
            readonly type: PackageType = PackageType.IntegerArray
            readonly address: Address = address
            readonly capacity: number = 4 + (values.byteLength << 2)
            put(output: ByteArrayOutput): void {
                update()
                output.writeInt(values.length)
                for (const value of values) {output.writeInt(value)}
            }
        })
    }

    /** Broadcasts a raw byte array after invoking the supplied update hook. */
    broadcastByteArray(address: Address, values: Int8Array, update: Exec): Terminable {
        return this.#storeChunk(new class implements Package {
            readonly type: PackageType = PackageType.ByteArray
            readonly address: Address = address
            readonly capacity: number = 4 + values.byteLength
            put(output: ByteArrayOutput): void {
                update()
                output.writeInt(values.byteLength)
                output.writeBytes(values)
            }
        })
    }

    #updateAvailable(): Option<ArrayBufferLike> {
            if (this.#invalid) {
                this.#availableUpdate = Option.wrap(this.#compileStructure())
                this.#invalid = false
            }
        if (this.#availableUpdate.nonEmpty()) {
            const option = this.#availableUpdate
            this.#availableUpdate = Option.None
            return option
        }
        return Option.None
    }

    #computeCapacity(): int {
        if (-1 === this.#capacity) {
            this.#capacity = this.#sumRequiredCapacity() + 12
        }
        return this.#capacity
    }

    /** Clears all stored packages and resets state. */
    terminate(): void {
        Arrays.clear(this.#packages)
        this.#availableUpdate = Option.None
        this.#invalid = false
        this.#capacity = 0
    }

    /** Writes the version and all package payloads into the buffer. */
    #flushData(output: ByteArrayOutput): void {
        assert(!this.#invalid && this.#availableUpdate.isEmpty(), "Cannot flush while update is available")
        const requiredCapacity = this.#computeCapacity()
        assert(output.remaining >= requiredCapacity, "Insufficient data")
        output.writeInt(this.#version)
        output.writeInt(Flags.START)
        for (const pack of this.#packages) {pack.put(output)}
        output.writeInt(Flags.END)
    }

    /** Computes the sum of capacities for all registered packages. */
    #sumRequiredCapacity(): int {
        return this.#packages.reduce((sum, pack) => sum + pack.capacity, 0)
    }

    /** Registers a package and returns a handle to remove it again. */
    #storeChunk(pack: Package): Terminable {
        this.#packages.push(pack)
        this.#invalidate()
        return {
            terminate: () => {
                Arrays.removeOpt(this.#packages, pack)
                this.#invalidate()
            }
        }
    }

    /** Marks the structure as outdated. */
    #invalidate(): void {
        this.#capacity = -1
        this.#invalid = true
    }

    /** Builds a structure description listing all packages and their types. */
    #compileStructure(): ArrayBufferLike {
        const output = ByteArrayOutput.create()
        output.writeInt(Flags.ID)
        output.writeInt(++this.#version)
        output.writeInt(this.#packages.length)
        for (const {address, type} of this.#packages) {
            address.write(output)
            output.writeByte(type)
        }
        return output.toArrayBuffer()
    }
}