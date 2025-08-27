import {FloatArray, int, Lazy, Option, Procedure} from "@opendaw/lib-std"
import type {OpfsProtocol, SamplePeakProtocol} from "@opendaw/lib-fusion"
import {Entry} from "@opendaw/lib-fusion"
import {Communicator, Messenger} from "@opendaw/lib-runtime"

/**
 * Installs and exposes protocol proxies for web worker communication.
 *
 * This utility sets up {@link Messenger} channels for background processing
 * tasks such as sample peak generation and OPFS access.
 *
 * @public
 */
export class WorkerAgents {

    /**
     * Installs the worker and prepares the underlying {@link Messenger}.
     *
     * @param workerURL - URL of the module worker to connect to.
     */
    static install(workerURL: string): void {
        console.debug("workerURL", workerURL)
        this.messenger = Option.wrap(Messenger.for(new Worker(workerURL, {type: "module"})))
    }

    /** Messenger used to communicate with background workers. */
    static messenger: Option<Messenger> = Option.None

    /**
     * Proxy for the sample-peak generation protocol running in the worker.
     */
    @Lazy
    static get Peak(): SamplePeakProtocol {
        return Communicator
            .sender<SamplePeakProtocol>(this.messenger.unwrap("WorkerAgents are not installed").channel("peaks"),
                router => new class implements SamplePeakProtocol {
                    async generateAsync(
                        progress: Procedure<number>,
                        shifts: Uint8Array,
                        frames: ReadonlyArray<FloatArray>,
                        numFrames: int,
                        numChannels: int): Promise<ArrayBufferLike> {
                        return router.dispatchAndReturn(this.generateAsync, progress, shifts, frames, numFrames, numChannels)
                    }
                })
    }

    /** Proxy for OPFS access available on the worker. */
    @Lazy
    static get Opfs(): OpfsProtocol {
        return Communicator
            .sender<OpfsProtocol>(this.messenger.unwrap("WorkerAgents are not installed").channel("opfs"),
                router => new class implements OpfsProtocol {
                    write(path: string, data: Uint8Array): Promise<void> {return router.dispatchAndReturn(this.write, path, data)}
                    read(path: string): Promise<Uint8Array> {return router.dispatchAndReturn(this.read, path)}
                    delete(path: string): Promise<void> {return router.dispatchAndReturn(this.delete, path)}
                    list(path: string): Promise<ReadonlyArray<Entry>> {return router.dispatchAndReturn(this.list, path)}
                })
    }
}
